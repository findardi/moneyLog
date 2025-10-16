import { tokenType } from "@/core/constant/types"
import db from "@/core/utils/database/connection"
import { token } from "@/core/utils/database/schema/token"
import { users } from "@/core/utils/database/schema/users"
import { BadRequest } from "@/core/utils/error/error-handler"
import logger from "@/core/utils/logger"
import { and, eq } from "drizzle-orm"

export const tokenService = {
    genToken: async () => {
        const max = Math.pow(10, 6)
        const randomBytes = new Uint32Array(1)
        crypto.getRandomValues(randomBytes)

        const randomNumber = randomBytes[0] % max
        return randomNumber.toString().padStart(6, '0')
    },

    getActivatedToken: async(username: string) => {
        const validToken = await tokenService.genToken()

        try {
            const user = await db.select({isActive: users.isActive}).from(users).where(eq(users.username, username)).then((result) => result[0])
            if (user.isActive) {
                throw new BadRequest("User already activated")
            }


            const result = await db.insert(token).values({
                token: validToken,
                username,
                type: "ACTIVATION",
            }).returning({token: token.token, username: token.username})

            return result
        } catch (error) {
            throw error
        }
    },

    getResetToken: async(username: string) => {
        const validToken = await tokenService.genToken()
        try {
            const user = await db.select({isActive: users.isActive}).from(users).where(eq(users.username, username)).then((result) => result[0])
            if (user.isActive) {
                throw new BadRequest("User already activated")
            }
            
            const result = await db.update(token).set({
                token: validToken,
                type: "RESET",
                updatedAt: new Date()
            }).where(eq(token.username, username)).returning({token: token.token, username: token.username})

            return result
        } catch (error) {
            throw error
        }
    },

    activatedUser: async(username: string, validToken: string) => {
        try {
            await db.transaction(async (trx) => {
                const result = await trx.select().from(token).where(and(eq(token.username, username), eq(token.token, validToken))).then((result) => result[0])
                if (!result) {
                    throw new BadRequest("Invalid token")
                }

                if (result.type !== tokenType.ACTIVATION && result.type !== tokenType.RESET) {
                    throw new BadRequest("Invalid token")
                }

                const expired = () => {
                    const created = result.type === tokenType.ACTIVATION ? new Date(result.createdAt) : new Date(result.updatedAt)

                    const now = new Date()
                    const diff = now.getTime() - created.getTime()
                    const exp = 5 * 60 * 1000

                    return diff > exp
                }

                if (expired()) {
                    throw new BadRequest("Token expired")
                }

                // update user status
                const updateUser = await trx.update(users).set({isActive: true, updatedAt: new Date()}).where(eq(users.username, username)).returning({username: users.username, isactive: users.isActive}).then((result) => result[0])

                // delete token
                await trx.delete(token).where(and(eq(token.username, username), eq(token.token,validToken)))

                return updateUser
            })
        } catch (error) {
            throw error
        }
    }
}