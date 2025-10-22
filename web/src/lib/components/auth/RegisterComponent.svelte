<script lang="ts">
    import { registerSchema, type registerDTO } from "$lib/schema/user.schema";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";

    interface registerProps {
        actions?: string;
    }

    let {
        form: formProp,
        actions = "",
    }: registerProps & { form: SuperValidated<registerDTO> } = $props();

    const form = superForm(formProp, {
        validators: zod4Client(registerSchema),
        validationMethod: "oninput",
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "redirect") {
                toast.success("register Success");
            } else if (result.type === "failure") {
                const errors = result.data?.form.errors;
                if (errors && typeof errors === "object") {
                    for (const [field, messages] of Object.entries(errors)) {
                        if (Array.isArray(messages)) {
                            for (const message of messages) {
                                toast.error(`${field}: ${message}`);
                            }
                        }
                    }
                } else if (result.data?.message) {
                    toast.error(result.data.message);
                } else {
                    toast.error("An unknown error occurred.");
                }
            }
        },
    });

    const { form: formData, enhance, delayed, submitting, reset } = form;

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
                                placeholder="user@email.com"
                                {...props}
                                bind:value={$formData.email}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>

                <Field {form} name="username">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="text-sm font-medium">Username</Label>
                            <input
                                type="text"
                                class="input-bordered input w-full"
                                placeholder="unique username"
                                {...props}
                                bind:value={$formData.username}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>

                <Field {form} name="first_name">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="text-sm font-medium">First Name</Label
                            >
                            <input
                                type="text"
                                class="input-bordered input w-full"
                                placeholder="first name"
                                {...props}
                                bind:value={$formData.first_name}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>

                <Field {form} name="last_name">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="text-sm font-medium">Last Name</Label>
                            <input
                                type="text"
                                class="input-bordered input w-full"
                                placeholder="last name"
                                {...props}
                                bind:value={$formData.last_name}
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
                                placeholder="secret password"
                                {...props}
                                bind:value={$formData.password}
                            />
                        {/snippet}
                    </Control>
                    <FieldErrors class="mt-1 text-sm text-red-400" />
                </Field>
            </div>

            <div class="flex my-4 flex-col space-y-2">
                <button
                    class="btn btn-neutral w-full"
                    type="submit"
                    disabled={$submitting}
                >
                    {#if $submitting}
                        <span class="loading loading-spinner"></span>
                        Sending...
                    {:else}
                        Register
                    {/if}
                </button>
                <button
                    class="btn btn-outline btn-error w-full"
                    type="button"
                    disabled={$submitting}
                    onclick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </form>

        <div class="divider"></div>
        <div class="my-2">
            <p class="text-sm text-center text-gray-600">
                By clicking "Register", you agree to our
                <a href="/terms" class="link link-primary"
                    >Terms and Conditions</a
                >
                and
                <a href="/privacy" class="link link-primary">Privacy Policy</a>.
            </p>
        </div>
    </div>
</div>
