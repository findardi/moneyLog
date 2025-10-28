<script lang="ts">
    import { periodEnum, updateSpendingLimitSchema, type updateSpendingLimitDto } from "$lib/schema/spending.schema";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Control, Field, FieldErrors } from "formsnap";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import type { spendingLimit } from "$lib/utils/types";

    interface updateProps {
        form?: SuperValidated<updateSpendingLimitDto>;
        isOpen?: boolean;
        onClose?: () => void;
        isLoading?: boolean;
        onSuccess?: () => void;
    }

    let {form: formProp, isOpen = $bindable(false), onClose = () => {}, onSuccess = () => {}} : updateProps = $props()

    let currentSpending = $state<spendingLimit | null>(null);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let id = $state(page.url.searchParams.get("id"));

    // Update id when URL changes
    $effect(() => {
        id = page.url.searchParams.get("id");
    });

    $effect(() => {
        if (!isOpen) return;
        
        isLoading = true;
        error = null;
        
        setTimeout(() => {
            fetch(`/api/dashboard/alert`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch spending limit");
                    return res.json();
                })
                .then(data => {
                    currentSpending = data as spendingLimit;
                    console.log("currentSpending", currentSpending)
                    isLoading = false;
                })
                .catch(err => {
                    error = err.message;
                    isLoading = false;
                });
        }, 500);
    });
    
    const form = superForm(formProp!, {
        validators: zod4Client(updateSpendingLimitSchema),
        validationMethod: "onblur",
        invalidateAll: true,
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "success") {
                toast.success("Update Success");
                // Clear id from URL
                const pathname = page.url.pathname;
                const currentParam = new URLSearchParams(page.url.searchParams);
                currentParam.delete("id");
                goto(`${pathname}?${currentParam.toString()}`, { replaceState: true });
                // Close modal and trigger success callback
                onClose();
                onSuccess();
            } else if (result.type === "failure") {
                handleLoginFailure(result.data);
            }
        },
    })

    function handleLoginFailure(data: any) {
        if (data?.apiError) {
            const apiError = data.apiError as ApiErrorResponse;
            toast.error(apiError.message, {
                duration: 5000,
            });
            return;
        }

        let errorMessage = "update failed";
        if (typeof data?.message === "string") {
            errorMessage = data.message;
        } else if (data?.form?.message) {
            errorMessage = data.form.message;
        }
        toast.error(errorMessage);
    }

    const {form: formData, enhance, submitting, reset} = form;

    const periode = periodEnum.options;

    let alertPercentageValue = $state($formData.alertPercentage ?? 0);
    let amountValue = $state($formData.amount ?? 0);
    let periodValue = $state($formData.period);
    
    // Update form values when currentSpending is fetched
    $effect(() => {
        if (currentSpending) {
            alertPercentageValue = currentSpending.alertPercentage;
            amountValue = currentSpending.amount;
            periodValue = currentSpending.period as any;
        }
    });
    
    $effect(() => {
        $formData.alertPercentage = alertPercentageValue;
        $formData.amount = amountValue;
        $formData.period = periodValue;
    });

    const handleCancel = () => {
        reset();
        toast.info("Form cleared");
        onClose();
        const pathname = page.url.pathname;
        const currentParam = new URLSearchParams(page.url.searchParams)
        currentParam.delete("id")
        goto(`${pathname}?${currentParam.toString()}`, { replaceState: false });
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
                <h2 class="text-xl font-bold text-stone-900 uppercase tracking-wide">Update Limit Spending</h2>
            </div>
            
            {#if isLoading}
                <div class="p-6 flex items-center justify-center">
                    <span class="loading loading-spinner loading-xl"></span>
                </div>
            {:else if error}
                <div class="p-6 flex items-center justify-center">
                    <p class="text-sm text-red-600">{error}</p>
                </div>
            {:else if currentSpending}
            <form action="?/updateSpending{id ? `&id=${id}` : ''}" method="post" use:enhance class="w-full space-y-3">
                <div class="flex flex-row justify-between gap-3">
                    <Field {form} name="alertPercentage" >
                        <Control>
                            {#snippet children({props})}
                                <div class="relative">
                                    <input type="number" class="w-full px-2 py-1.5 pt-4 border-3 border-stone-900 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                                    transition-all duration-200 font-medium text-sm
                                    placeholder:text-stone-400" 
                                    {...props}
                                    placeholder={String(currentSpending?.alertPercentage || "")}
                                    bind:value={alertPercentageValue}
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
                                    placeholder={String(currentSpending?.amount || "")}
                                    bind:value={amountValue}
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
                                        bind:value={periodValue}
                                    >
                                        <option value="">{currentSpending?.period|| "Period"}</option>
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
                                Updating...
                            </span>
                        {:else}
                            Update Limit
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
            {:else}
                <div class="p-6 flex items-center justify-center">
                    <p class="text-sm text-stone-600">No data available</p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .border-3 {
        border-width: 3px;
    }
</style>