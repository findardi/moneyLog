<script lang="ts">
    import { createSpendingLimitSchema, periodEnum, type createSpendingLimitDto } from "$lib/schema/spending.schema";
    import { Control, Field, FieldErrors } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { invalidateAll } from "$app/navigation";

    interface insertProps{
        form?: SuperValidated<createSpendingLimitDto>;
        isOpen?: boolean;
        onClose?: () => void;
        isLoading?: boolean;
        onSuccess?: () => void;
    }

    let {form: formProp, isOpen = $bindable(false), onClose = () => {}, isLoading = $bindable(false), onSuccess = () => {}} : insertProps = $props()

    const form = superForm(formProp!, {
        validators: zod4Client(createSpendingLimitSchema),
        validationMethod: "onblur",
        resetForm: true,
        invalidateAll: true,
        dataType: "json",
        delayMs: 500,
        onResult: async ({result}) => {
            if (result.type === "success") {
                toast.success("Create Spending Limit Successfully");
                await invalidateAll();
                reset();
                onClose();
                onSuccess();
            } else if (result.type === "failure") {
                toast.error("Failed to create spending limit");
            }
        }
    })

    const {form: formData, enhance, submitting, reset} = form;

    const periode = periodEnum.options;

    const handleCancel = () => {
        reset();
        toast.info("Form cleared");
        onClose();
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
            handleCancel();
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };
</script>

{#if isOpen}
    <div  class="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={handleBackdropClick}
        role="presentation">
        <div class="bg-white border-3 border-stone-900 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] w-full max-w-2xl p-6">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-stone-900 uppercase tracking-wide">Limit Spending</h2>
            </div>
            <form action="?/createSpending" method="post" use:enhance class="w-full space-y-3">
                <div class="flex flex-row justify-between gap-3">
                    <Field {form} name="alertPercentage" >
                        <Control>
                            {#snippet children({props})}
                                <div class="relative">
                                    <input type="number" class="w-full px-2 py-1.5 pt-4 border-3 border-stone-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                                    transition-all duration-200 font-medium text-sm
                                    placeholder:text-stone-400" 
                                    {...props}
                                    placeholder="80%"
                                    bind:value={$formData.alertPercentage}
                                    />
                                    <span class="absolute top-1 left-2 text-[9px] font-bold text-stone-500 uppercase tracking-wide">Alert Percentage</span>
                                </div>
                            {/snippet}
                        </Control>
                        <FieldErrors class="mt-1 text-xs font-bold text-red-600"/>
                    </Field>
                    <Field {form} name="amount" >
                        <Control>
                            {#snippet children({props})}
                                <div class="relative">
                                    <input type="number" class="w-full px-2 py-1.5 pt-4 border-3 border-stone-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                                    transition-all duration-200 font-medium text-sm
                                    placeholder:text-stone-400" 
                                    {...props}
                                    placeholder="45000"
                                    bind:value={$formData.amount}
                                    />
                                    <span class="absolute top-1 left-2 text-[9px] font-bold text-stone-500 uppercase tracking-wide">Amount</span>
                                </div>
                            {/snippet}
                        </Control>
                        <FieldErrors class="mt-1 text-xs font-bold text-red-600"/>
                    </Field>
                    <Field {form} name="period" >
                        <Control>
                            {#snippet children({props})}
                                <div class="relative">
                                    <select
                                        class="w-full px-2 py-1.5 pt-4 border-3 border-stone-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                                        transition-all duration-200 font-medium text-sm
                                        bg-white appearance-none"
                                        {...props}
                                        bind:value={$formData.period}
                                    >
                                        <option value="">Period</option>
                                        {#each periode as period}
                                            <option value={period}>{period}</option>
                                        {/each}
                                    </select>
                                    <span class="absolute top-1 left-2 text-[9px] font-bold text-stone-500 uppercase tracking-wide pointer-events-none">Period</span>
                                </div>
                            {/snippet}
                        </Control>
                        <FieldErrors class="mt-1 text-xs font-bold text-red-600"/>
                    </Field>
                </div>
                <div class="flex gap-3 pt-1">
                    <button
                        class="flex-1 px-3 py-1.5 bg-stone-900 text-white font-bold text-sm
                               border-3 border-stone-900
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-1px] hover:translate-y-[-1px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               disabled:hover:translate-x-0 disabled:hover:translate-y-0
                               uppercase tracking-wide"
                        type="submit"
                        disabled={$submitting}
                    >
                        {#if $submitting}
                            <span class="flex items-center justify-center gap-2">
                                <span class="loading loading-spinner loading-sm"></span>
                                Creating...
                            </span>
                        {:else}
                            Create Limit
                        {/if}
                    </button>

                    <button
                        class="flex-1 px-3 py-1.5 bg-white text-stone-900 font-bold text-sm
                               border-3 border-stone-900
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-1px] hover:translate-y-[-1px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
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