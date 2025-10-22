<script lang="ts">
    import { loginSchema, type loginDTO } from "$lib/schema/user.schema";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";

    interface loginProps {
        actions?: string;
    }

    let {
        form: formProp,
        actions = "",
    }: loginProps & { form: SuperValidated<loginDTO> } = $props();

    const form = superForm(formProp, {
        validators: zod4Client(loginSchema),
        validationMethod: "oninput",
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "redirect") {
                toast.success("Login Success");
            } else if (result.type === "failure") {
                handleLoginFailure(result.data);
            }
        },
    });

    const { form: formData, enhance, delayed, submitting, reset } = form;

    function handleLoginFailure(data: any) {
        if (data?.apiError) {
            const apiError = data.apiError as ApiErrorResponse;
            toast.error(apiError.message, {
                duration: 5000,
            });
            return;
        }

        let errorMessage = "Login failed";
        if (typeof data?.message === "string") {
            errorMessage = data.message;
        } else if (data?.form?.message) {
            errorMessage = data.form.message;
        }
        toast.error(errorMessage);
    }

    function handleCancel() {
        reset();
        toast.info("form cleared");
    }
</script>

<div class="p-2">
    <div class="card bg-none w-full h-full">
        <form
            method="post"
            action={actions}
            use:enhance
            class="w-full space-y-4"
        >
            <div class="w-full space-y-2">
                <Field {form} name="email">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="text-sm font-medium">Email</Label>
                            <input
                                type="text"
                                class="input-bordered input w-full"
                                placeholder="user@gmail.com"
                                {...props}
                                bind:value={$formData.email}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>

                <Field {form} name="password">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="text-sm font-medium">Password</Label>
                            <input
                                type="password"
                                class="input-bordered input w-full"
                                placeholder="password"
                                {...props}
                                bind:value={$formData.password}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>
            </div>

            <div class="flex my-4">
                <button
                    class="btn btn-neutral w-full"
                    type="submit"
                    disabled={$submitting}
                >
                    {#if $submitting}
                        <span class="loading loading-spinner"></span>
                        Mengirim...
                    {:else}
                        Login
                    {/if}
                </button>
                <!-- <button
                    class="btn btn-outline btn-error"
                    type="button"
                    disabled={$submitting}
                    onclick={handleCancel}
                >
                    Cancel
                </button> -->
            </div>
        </form>

        <div class="divider"></div>
        <div class="my-2">
            <p class="text-sm text-center text-gray-600">
                By clicking "Login", you agree to our
                <a href="/terms" class="link link-primary"
                    >Terms and Conditions</a
                >
                and
                <a href="/privacy" class="link link-primary">Privacy Policy</a>.
            </p>
        </div>
    </div>
</div>
