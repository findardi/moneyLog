import db from "@/core/utils/database/connection";
import { createUserDto, loginUserDto } from "./dto/user.create.dto";
import { users } from "@/core/utils/database/schema/users";
import { BadRequest, Conflict } from "@/core/utils/error/error-handler";
import { eq } from "drizzle-orm";
import { generatedToken } from "@/core/utils/middleware/jwt";

export const userService = {
    create: async(request: createUserDto) => {
        const {username, email, password, fullname} = request;
        
        try {
            const hashPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 12
            })

            const result = await db.insert(users).values({
                username,
                email,
                password: hashPassword,
                fullName: fullname,
            }).returning({username: users.username})

            return result
        } catch (error: any) {
            const pgError = error.cause || error;
            const errorCode = pgError.code || error.code;
            const errorMessage = error.message?.toLowerCase() || "";
            
            if (errorCode === "23505" || errorMessage.includes("duplicate") || errorMessage.includes("unique")) {
                if (errorMessage.includes("username")) {
                    throw new Conflict("Username already exists");
                }
                if (errorMessage.includes("email")) {
                    throw new Conflict("Email already exists");
                }
                throw new Conflict("Duplicate entry detected");
            }
            throw error;
        }
    },

    login: async(request: loginUserDto) => {
        const {email, password} = request;

        try {
            const [result] = await db.select({password: users.password, id: users.id, username: users.username, role: users.role }).from(users).where(eq(users.email, email)).limit(1)
            if (!result) {
                throw new BadRequest("Email or password is incorrect")
            }

            const validPassword = await Bun.password.verify(password, result.password)
            if (!validPassword) {
                throw new BadRequest("Email or password is incorrect")
            }

            const token = await generatedToken({
                id: result.id,
                username: result.username,
                role: result.role,
            })

            return token
        } catch (error) {
            throw error
        }
    },
}