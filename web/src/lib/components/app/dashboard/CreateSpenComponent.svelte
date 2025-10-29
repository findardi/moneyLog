<script lang="ts">
    import {
        createSpendingLimitSchema,
        periodEnum,
        type createSpendingLimitDto,
    } from "$lib/schema/spending.schema";
    import { Control, Field, FieldErrors } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { invalidateAll } from "$app/navigation";
    import {
        handleBackdropClick,
        handleFailure,
        handleKeydown,
    } from "$lib/utils/common/handle";
    import InputComponent from "$lib/components/form/InputComponent.svelte";
    import SelectComponent from "$lib/components/form/SelectComponent.svelte";

    interface insertProps {
        form?: SuperValidated<createSpendingLimitDto>;
        isOpen?: boolean;
        onClose?: () => void;
        isLoading?: boolean;
        onSuccess?: () => void;
    }

    let {
        form: formProp,
        isOpen = $bindable(false),
        onClose = () => {},
        isLoading = $bindable(false),
        onSuccess = () => {},
    }: insertProps = $props();

    const form = superForm(formProp!, {
        validators: zod4Client(createSpendingLimitSchema),
        validationMethod: "onblur",
        resetForm: true,
        invalidateAll: true,
        dataType: "json",
        delayMs: 500,
        onResult: async ({ result }) => {
            if (result.type === "success") {
                toast.success("Create Spending Limit Successfully");
                await invalidateAll();
                reset();
                onClose();
                onSuccess();
            } else if (result.type === "failure") {
                handleFailure(result.data, "Failed Create Spending Limit");
            }
        },
    });

    const { form: formData, enhance, submitting, reset } = form;

    const periode = periodEnum.options;

    const handleCancel = () => {
        reset();
        toast.info("Form cleared");
        onClose();
    };
</script>

<svelte:window onkeydown={(e) => handleKeydown(e, onClose, isOpen)} />

{#if isOpen}
    <div
        class="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={(e) => handleBackdropClick(e, onClose)}
        role="presentation"
    >
        <div
            class="bg-white border-3 border-stone-900 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] w-full max-w-2xl p-6"
        >
            <div class="mb-6">
                <h2
                    class="text-2xl font-bold text-stone-900 uppercase tracking-wide"
                >
                    Create Spending Limit
                </h2>
            </div>
            <form
                action="?/createSpending"
                method="post"
                use:enhance
                class="w-full space-y-5"
            >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="w-full">
                        <Field {form} name="alertPercentage">
                            <Control>
                                {#snippet children({ props })}
                                <InputComponent
                                    type="number"
                                    bind:value={$formData.alertPercentage}
                                    nameField="Alert %"
                                    placeholder="80"
                                    {...props}
                                />
                                {/snippet}
                            </Control>
                            <FieldErrors
                                class="mt-1 text-xs font-bold text-red-600"
                            />
                        </Field>
                    </div>
                    
                    <div class="w-full">
                        <Field {form} name="amount">
                            <Control>
                                {#snippet children({ props })}
                                <InputComponent
                                    type="number"
                                    bind:value={$formData.amount}
                                    nameField="Amount"
                                    placeholder="45000"
                                    {...props}
                                />
                                {/snippet}
                            </Control>
                            <FieldErrors
                                class="mt-1 text-xs font-bold text-red-600"
                            />
                        </Field>
                    </div>
                    
                    <div class="w-full">
                        <Field {form} name="period">
                            <Control>
                                {#snippet children({ props })}
                                <SelectComponent
                                    data={periode}
                                    placeholder="Select period..."
                                    nameField="Period"
                                    bind:value={$formData.period}
                                    searchable={true}
                                    clearable={true}
                                    {...props}
                                />
                                {/snippet}
                            </Control>
                            <FieldErrors
                                class="mt-1 text-xs font-bold text-red-600"
                            />
                        </Field>
                    </div>
                </div>
                <div class="flex gap-4 pt-2">
                    <button
                        class="flex-1 px-6 py-4 bg-stone-900 text-white font-bold text-base
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
                            <span
                                class="flex items-center justify-center gap-2"
                            >
                                <span class="loading loading-spinner loading-sm"
                                ></span>
                                Creating...
                            </span>
                        {:else}
                            Create Limit
                        {/if}
                    </button>

                    <button
                        class="flex-1 px-6 py-4 bg-white text-stone-900 font-bold text-base
                               border-3 border-stone-900
                               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               disabled:hover:translate-x-0 disabled:hover:translate-y-0
                               uppercase tracking-wide"
                        type="button"
                        onclick={handleCancel}
                        disabled={$submitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
