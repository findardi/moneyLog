<script lang="ts">
    import { page } from "$app/state";
    import { activationSchema } from "$lib/schema/user.schema";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { onDestroy } from "svelte";

    const formProp = $derived(page.data.activationForm);
    let showTokenInput = $state(false);
    let isGeneratingToken = $state(false);
    let currentRegenerate = $state(0);
    let timeLeft = $state(300); // 5 minutes in seconds
    let timerInterval: number | null = null;
    let tokenExpired = $state(false);

    const form = superForm(formProp, {
        validators: zod4Client(activationSchema),
        validationMethod: "oninput",
        delayMs: 500,
        onResult: async ({ result }) => {
            if (result.type === "redirect") {
                await new Promise((resolve) => setTimeout(resolve, 500));
                toast.success(
                    "Account activated successfully!, please login again.",
                    {
                        duration: 4000,
                    },
                );
            } else if (result.type === "failure") {
                handleVerifyFailure(result.data);
            }
        },
    });

    const { form: formData, enhance, submitting } = form;

    // Format time as MM:SS
    const formattedTime = $derived(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    });

    // Start countdown timer
    function startTimer() {
        timeLeft = 300; // Reset to 5 minutes
        tokenExpired = false;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(() => {
            timeLeft -= 1;

            if (timeLeft <= 0) {
                tokenExpired = true;
                if (timerInterval) clearInterval(timerInterval);
                toast.warning("Token expired! Please regenerate.", {
                    duration: 5000,
                });
            }
        }, 1000);
    }

    // Stop timer
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    onDestroy(() => {
        stopTimer();
    });

    function handleVerifyFailure(data: any) {
        if (data?.apiError) {
            const apiError = data.apiError as ApiErrorResponse;
            toast.error(apiError.message, {
                duration: 5000,
            });
            return;
        }

        let errorMessage = "Verification failed";
        if (typeof data?.message === "string") {
            errorMessage = data.message;
        } else if (data?.form?.message) {
            errorMessage = data.form.message;
        }
        toast.error(errorMessage);
    }

    async function handleGetToken() {
        isGeneratingToken = true;
        try {
            const formData = new FormData();
            const response = await fetch("?/getToken", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                showTokenInput = true;
                currentRegenerate = 0; // Reset counter
                startTimer(); // Start countdown
                toast.success(
                    "Token sent to your email! Valid for 5 minutes.",
                    {
                        duration: 4000,
                    },
                );
            } else {
                const result = await response.json();
                toast.error(
                    result?.apiError?.message || "Failed to generate token",
                    {
                        duration: 5000,
                    },
                );
            }
        } catch (error) {
            toast.error("An error occurred while generating token", {
                duration: 5000,
            });
        } finally {
            isGeneratingToken = false;
        }
    }

    async function handleRegenerate() {
        // Check if max regenerate limit reached
        if (currentRegenerate >= 3) {
            toast.error(
                "Maximum regeneration limit reached (3/3). Please try again later.",
                { duration: 5000 },
            );
            return;
        }

        isGeneratingToken = true;

        try {
            const formData = new FormData();
            const response = await fetch("?/resetToken", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                currentRegenerate += 1;
                startTimer(); // Restart countdown

                const remainingAttempts = 3 - currentRegenerate;
                toast.success(
                    `New token sent! (${currentRegenerate}/3 attempts used, ${remainingAttempts} remaining)`,
                    {
                        duration: 4000,
                    },
                );
            } else {
                const result = await response.json();
                toast.error(
                    result?.apiError?.message || "Failed to regenerate token",
                    {
                        duration: 5000,
                    },
                );
            }
        } catch (error) {
            toast.error("An error occurred while regenerating token", {
                duration: 5000,
            });
        } finally {
            isGeneratingToken = false;
        }
    }
</script>

<div class="w-full">
    {#if !showTokenInput}
        <div class="space-y-4">
            <div class="flex items-center gap-2">
                <h2
                    class="text-xl md:text-2xl font-black text-stone-900 uppercase"
                >
                    Account Activation
                </h2>
                <div class="flex-grow h-[3px] bg-stone-900"></div>
            </div>

            <div
                class="relative bg-amber-100 border-3 border-stone-900 p-6
                       shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                       transition-all duration-200"
            >
                <div
                    class="absolute -top-2 -right-2 bg-red-500 text-white
                           px-3 py-1 text-xs font-bold border-3 border-stone-900
                           rotate-[3deg]"
                >
                    🔒 LOCKED
                </div>

                <div class="flex flex-col space-y-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="bg-blue-100 border-3 border-stone-900 p-3
                                   shadow-[3px_3px_0px_0px_rgba(41,37,36,1)] flex-shrink-0"
                        >
                            <span class="text-3xl">🎯</span>
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="text-lg font-black text-stone-900">
                                Activate Now!
                            </h3>
                            <p class="text-sm text-stone-700 font-medium">
                                Unlock features and get full access to your
                                account
                            </p>
                        </div>
                    </div>

                    <button
                        onclick={handleGetToken}
                        disabled={isGeneratingToken}
                        class="w-full px-6 py-3.5 bg-stone-900 text-white font-bold text-base
                               border-3 border-stone-900
                               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               disabled:hover:translate-x-0 disabled:hover:translate-y-0
                               uppercase tracking-wide"
                    >
                        {#if isGeneratingToken}
                            <span
                                class="flex items-center justify-center gap-2"
                            >
                                <span class="loading loading-spinner loading-sm"
                                ></span>
                                Generating...
                            </span>
                        {:else}
                            Get Activation Token →
                        {/if}
                    </button>

                    <p class="text-xs text-center text-stone-600 font-medium">
                        We'll send the token to your registered email
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div
                    class="bg-green-100 border-3 border-stone-900 p-3
                           shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]"
                >
                    <div class="flex flex-col items-center text-center">
                        <span class="text-xl font-black">📊</span>
                        <span class="text-xs font-bold text-stone-700 mt-1"
                            >Advanced Reports</span
                        >
                    </div>
                </div>
                <div
                    class="bg-blue-100 border-3 border-stone-900 p-3
                           shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]"
                >
                    <div class="flex flex-col items-center text-center">
                        <span class="text-xl font-black">🤖</span>
                        <span class="text-xs font-bold text-stone-700 mt-1"
                            >AI Insights</span
                        >
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="space-y-4">
            <div class="flex items-center gap-2">
                <h2
                    class="text-xl md:text-2xl font-black text-stone-900 uppercase"
                >
                    Enter Token
                </h2>
                <div class="flex-grow h-[3px] bg-stone-900"></div>
            </div>
            <div
                class="relative bg-white border-3 border-stone-900 p-6
                       shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                       transition-all duration-200"
            >
                <div
                    class="absolute -top-2 -right-2 text-stone-900
                           px-3 py-1 text-xs font-bold border-3 border-stone-900
                           rotate-[3deg] {tokenExpired
                        ? 'bg-red-500 text-white'
                        : 'bg-green-200'}"
                >
                    {#if tokenExpired}
                        ⏰ EXPIRED
                    {:else}
                        ⏰ {formattedTime()}
                    {/if}
                </div>

                <form
                    method="post"
                    action="?/verifyToken"
                    use:enhance
                    class="space-y-4"
                >
                    <div class="text-center space-y-1">
                        <p class="text-sm text-stone-600 font-medium">
                            Check your email for the activation code
                        </p>
                        {#if !tokenExpired}
                            <p class="text-xs text-stone-500 font-medium">
                                Token expires in <span
                                    class="font-bold text-red-600"
                                    >{formattedTime()}</span
                                >
                            </p>
                        {:else}
                            <p class="text-xs text-red-600 font-bold">
                                ⚠️ Token has expired! Please regenerate.
                            </p>
                        {/if}
                    </div>

                    <Field {form} name="token">
                        <Control>
                            {#snippet children({ props })}
                                <Label
                                    class="text-sm font-bold text-stone-900 uppercase tracking-wide"
                                    >Activation Token</Label
                                >
                                <input
                                    type="text"
                                    class="w-full px-4 py-3 text-center text-xl font-bold
                                           border-3 border-stone-900
                                           focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                           transition-all duration-200
                                           placeholder:text-stone-400 uppercase tracking-widest
                                           {tokenExpired ? 'bg-red-50' : ''}"
                                    placeholder="XXXXXX"
                                    maxlength="6"
                                    disabled={tokenExpired}
                                    {...props}
                                    bind:value={$formData.token}
                                />
                            {/snippet}
                        </Control>
                        <FieldErrors
                            class="mt-2 text-sm font-bold text-red-600"
                        />
                    </Field>

                    <div class="flex flex-col space-y-2 pt-2">
                        <button
                            type="submit"
                            disabled={$submitting || tokenExpired}
                            class="w-full px-6 py-3.5 bg-stone-900 text-white font-bold text-base
                                   border-3 border-stone-900
                                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   disabled:hover:translate-x-0 disabled:hover:translate-y-0
                                   uppercase tracking-wide"
                        >
                            {#if $submitting}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <span
                                        class="loading loading-spinner loading-sm"
                                    ></span>
                                    Verifying...
                                </span>
                            {:else if tokenExpired}
                                Token Expired - Regenerate Required
                            {:else}
                                Activate Account →
                            {/if}
                        </button>

                        <button
                            type="button"
                            onclick={handleRegenerate}
                            disabled={$submitting ||
                                isGeneratingToken ||
                                currentRegenerate >= 3}
                            class="w-full px-6 py-3 text-stone-900 font-bold text-sm
                                   border-3 border-stone-900
                                   shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   uppercase tracking-wide
                                   {currentRegenerate >= 3
                                ? 'bg-red-100'
                                : tokenExpired
                                  ? 'bg-amber-100'
                                  : 'bg-blue-100'}"
                        >
                            {#if isGeneratingToken}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <span
                                        class="loading loading-spinner loading-sm"
                                    ></span>
                                    Generating...
                                </span>
                            {:else if currentRegenerate >= 3}
                                ❌ Max Limit Reached (3/3)
                            {:else if tokenExpired}
                                ⚠️ Token Expired - Click to Regenerate ({currentRegenerate}/3)
                            {:else}
                                🔄 Regenerate Token ({currentRegenerate}/3)
                            {/if}
                        </button>
                    </div>
                </form>

                <div
                    class="mt-4 border-3 border-stone-900 p-3
                           shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                           {tokenExpired ? 'bg-red-100' : 'bg-yellow-100'}"
                >
                    <div class="flex items-start gap-2">
                        <span class="text-base"
                            >{tokenExpired ? "⚠️" : "ℹ️"}</span
                        >
                        <div class="flex-1 space-y-1">
                            {#if tokenExpired}
                                <p class="text-xs text-stone-700 font-bold">
                                    Your token has expired after 5 minutes.
                                </p>
                                <p class="text-xs text-stone-600 font-medium">
                                    Click "Regenerate Token" to receive a new
                                    one. You have {3 - currentRegenerate} attempt(s)
                                    remaining.
                                </p>
                            {:else}
                                <p class="text-xs text-stone-700 font-medium">
                                    Didn't receive the email? Check your spam
                                    folder or click regenerate.
                                </p>
                                <p class="text-xs text-stone-600 font-medium">
                                    You have {3 - currentRegenerate} regeneration
                                    attempt(s) remaining.
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
