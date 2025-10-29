<script lang="ts">
    import { registerSchema, type registerDTO } from "$lib/schema/user.schema";
    import { handleFailure } from "$lib/utils/common/handle";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import InputComponent from "../form/InputComponent.svelte";

    interface registerProps {
        actions?: string;
        onSuccess?: () => void;
    }

    let {
        form: formProp,
        actions = "",
        onSuccess,
    }: registerProps & { form: SuperValidated<registerDTO> } = $props();

    const form = superForm(formProp, {
        validators: zod4Client(registerSchema),
        validationMethod: "oninput",
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "success") {
                toast.success("Register Success, please login.", {
                    duration: 4000,
                });
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 500);
                }
            } else if (result.type === "failure") {
                handleFailure(result.data, "Register Failed");
            }
        },
    });

    const { form: formData, enhance, submitting, reset } = form;

    function handleCancel() {
        reset();
        toast.info("form cleared");
    }
</script>

<div class="w-full">
    <form method="post" action={actions} use:enhance class="w-full space-y-4">
        <div class="w-full space-y-3">
            <Field {form} name="email">
                <Control>
                    {#snippet children({ props })}
                    <InputComponent
                        nameField="Email"
                        placeholder="user@email.com"
                        {...props}
                        bind:value={$formData.email}
                    />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-1.5 text-xs font-bold text-red-600" />
            </Field>

            <Field {form} name="username">
                <Control>
                    {#snippet children({ props })}
                    <InputComponent
                        nameField="Username"
                        placeholder="unique username"
                        {...props}
                        bind:value={$formData.username}
                    />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-1.5 text-xs font-bold text-red-600" />
            </Field>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="w-full">
                    <Field {form} name="first_name">
                        <Control>
                            {#snippet children({ props })}
                                <InputComponent
                                    nameField="First Name"
                                    placeholder="First"
                                    {...props}
                                    bind:value={$formData.first_name}
                                />
                            {/snippet}
                        </Control>
                        <FieldErrors
                            class="mt-1.5 text-xs font-bold text-red-600 min-h-[1rem]"
                        />
                    </Field>
                </div>

                <div class="w-full">
                    <Field {form} name="last_name">
                        <Control>
                            {#snippet children({ props })}
                                <InputComponent
                                    nameField="Last Name"
                                    placeholder="Last"
                                    {...props}
                                    bind:value={$formData.last_name}
                                />
                            {/snippet}
                        </Control>
                        <FieldErrors
                            class="mt-1.5 text-xs font-bold text-red-600 min-h-[1rem]"
                        />
                    </Field>
                </div>
            </div>

            <Field {form} name="password">
                <Control>
                    {#snippet children({ props })}
                        <InputComponent
                            type="password"
                            nameField="Password"
                            placeholder="secret password"
                            {...props}
                            bind:value={$formData.password}
                        />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-1.5 text-xs font-bold text-red-600" />
            </Field>

            <Field {form} name="confirmPassword">
                <Control>
                    {#snippet children({ props })}
                        <InputComponent
                            type="password"
                            nameField="Confirm Password"
                            placeholder="confirm password"
                            {...props}
                            bind:value={$formData.confirmPassword}
                        />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-1.5 text-xs font-bold text-red-600" />
            </Field>
        </div>

        <div class="flex flex-col space-y-2 pt-2">
            <button
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
                type="submit"
                disabled={$submitting}
            >
                {#if $submitting}
                    <span class="flex items-center justify-center gap-2">
                        <span class="loading loading-spinner loading-sm"></span>
                        Sending...
                    </span>
                {:else}
                    Register →
                {/if}
            </button>
            <button
                class="w-full px-6 py-3.5 bg-white text-stone-900 font-bold text-base
                       border-3 border-stone-900
                       shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                       hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                       hover:translate-x-[-2px] hover:translate-y-[-2px]
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       uppercase tracking-wide"
                type="button"
                disabled={$submitting}
                onclick={handleCancel}
            >
                Clear
            </button>
        </div>
    </form>

    <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t-3 border-stone-900"></div>
        </div>
        <div class="relative flex justify-center">
            <span
                class="bg-white px-4 text-sm font-bold text-stone-900 uppercase"
            >
                Terms
            </span>
        </div>
    </div>

    <div class="mt-4">
        <p
            class="text-xs text-center text-stone-600 font-medium leading-relaxed"
        >
            By clicking "Register", you agree to our
            <a
                href="/terms"
                class="font-bold text-stone-900 hover:underline decoration-2 underline-offset-2"
                >Terms and Conditions</a
            >
            and
            <a
                href="/privacy"
                class="font-bold text-stone-900 hover:underline decoration-2 underline-offset-2"
                >Privacy Policy</a
            >.
        </p>
    </div>
</div>

<style>
    .border-3 {
        border-width: 3px;
    }

    .border-t-3 {
        border-top-width: 3px;
    }
</style>
