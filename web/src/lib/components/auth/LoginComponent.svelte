<script lang="ts">
    import { loginSchema, type loginDTO } from "$lib/schema/user.schema";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { handleFailure } from "$lib/utils/common/handle";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import InputComponent from "../form/InputComponent.svelte";

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
                handleFailure(result.data, "Login Failed");
            }
        },
    });

    const { form: formData, enhance, submitting } = form;
</script>

<div class="w-full">
    <form method="post" action={actions} use:enhance class="w-full space-y-5">
        <div class="w-full space-y-4">
            <Field {form} name="email">
                <Control>
                    {#snippet children({ props })}
                    <InputComponent
                        nameField="Email"
                        placeholder="user@gmail.com"
                        {...props}
                        bind:value={$formData.email}
                    />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-2 text-sm font-bold text-red-600" />
            </Field>

            <Field {form} name="password">
                <Control>
                    {#snippet children({ props })}
                    <InputComponent
                        type="password"
                        nameField="Password"
                        placeholder="password"
                        {...props}
                        bind:value={$formData.password}
                    />
                    {/snippet}
                </Control>
                <FieldErrors class="mt-2 text-sm font-bold text-red-600" />
            </Field>
        </div>

        <div class="flex pt-2">
            <button
                class="w-full px-6 py-4 bg-stone-900 text-white font-bold text-base
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
                    Login →
                {/if}
            </button>
        </div>
    </form>

    <div class="relative my-6">
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
            By clicking "Login", you agree to our
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
