<script lang="ts">
    import {
        periodEnum,
        updateSpendingLimitSchema,
        type updateSpendingLimitDto,
    } from "$lib/schema/spending.schema";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Control, Field, FieldErrors } from "formsnap";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import type { spendingLimit } from "$lib/utils/types";
    import {
        handleBackdropClick,
        handleFailure,
        handleKeydown,
    } from "$lib/utils/common/handle";
    import InputComponent from "$lib/components/form/InputComponent.svelte";
    import SelectComponent from "$lib/components/form/SelectComponent.svelte";

    interface updateProps {
        form?: SuperValidated<updateSpendingLimitDto>;
        isOpen?: boolean;
        onClose?: () => void;
        isLoading?: boolean;
        onSuccess?: () => void;
    }

    let {
        form: formProp,
        isOpen = $bindable(false),
        onClose = () => {},
        onSuccess = () => {},
    }: updateProps = $props();

    let currentSpending = $state<spendingLimit | null>(null);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let id = $state(page.url.searchParams.get("id"));

    $effect(() => {
        id = page.url.searchParams.get("id");
    });

    $effect(() => {
        if (!isOpen) return;

        isLoading = true;
        error = null;
            fetch(`/api/dashboard/alert`)
                .then((res) => {
                    if (!res.ok)
                        throw new Error("Failed to fetch spending limit");
                    return res.json();
                })
                .then((data) => {
                    currentSpending = data as spendingLimit;
                    console.log("currentSpending", currentSpending);
                    isLoading = false;
                })
                .catch((err) => {
                    error = err.message;
                    isLoading = false;
                });
    });

    const form = superForm(formProp!, {
        validators: zod4Client(updateSpendingLimitSchema),
        validationMethod: "onblur",
        invalidateAll: true,
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "success") {
                toast.success("Update Success");
                const pathname = page.url.pathname;
                const currentParam = new URLSearchParams(page.url.searchParams);
                currentParam.delete("id");
                goto(`${pathname}?${currentParam.toString()}`, {
                    replaceState: true,
                });
                onClose();
                onSuccess();
            } else if (result.type === "failure") {
                handleFailure(result.data, "Failed Update Spending Limit");
            }
        },
    });

    const { form: formData, enhance, submitting, reset } = form;

    const periode = periodEnum.options;

    let alertPercentageValue = $state($formData.alertPercentage ?? 0);
    let amountValue = $state($formData.amount ?? 0);
    let periodValue = $state($formData.period);

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
        const currentParam = new URLSearchParams(page.url.searchParams);
        currentParam.delete("id");
        goto(`${pathname}?${currentParam.toString()}`, { replaceState: false });
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
                    Update Spending Limit
                </h2>
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
                <form
                    action="?/updateSpending{id ? `&id=${id}` : ''}"
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
                                        bind:value={alertPercentageValue}
                                        nameField="Alert %"
                                        placeholder="0"
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
                                        bind:value={amountValue}
                                        nameField="Amount"
                                        placeholder="0"
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
                                        bind:value={periodValue}
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
                                    <span
                                        class="loading loading-spinner loading-sm"
                                    ></span>
                                    Updating...
                                </span>
                            {:else}
                                Update Limit
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
