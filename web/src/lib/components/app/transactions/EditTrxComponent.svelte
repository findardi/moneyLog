<script lang="ts">
    import { X, Calendar, Tag, DollarSign, Clock } from "@lucide/svelte";
    import { expenseStore } from "$lib/stores/expense.svelte";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import {
        updateExpenseSchema,
        type updateExpenseDTO,
    } from "$lib/schema/expense.schema";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import type { expenseDetail } from "$lib/utils/types";
    import { handleFailure } from "$lib/utils/common/handle";
    import InputComponent from "$lib/components/form/InputComponent.svelte";

    let expense = $derived(expenseStore.expenseDetail);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    const id = page.url.searchParams.get("detailId");

    $effect(() => {
        if (!id) return;

        isLoading = true;
        error = null;

        setTimeout(() => {
            fetch(`/api/expense/${id}`)
                .then((res) => {
                    if (!res.ok)
                        throw new Error("Failed to fetch expense detail");
                    return res.json();
                })
                .then((data) => {
                    expenseStore.setExpenseDetail(data as expenseDetail);
                    isLoading = false;
                })
                .catch((err) => {
                    error = err.message;
                    isLoading = false;
                });
        }, 500);
    });

    let {
        form: formProp,
    }: {
        form: SuperValidated<updateExpenseDTO>;
    } = $props();

    const form = superForm(formProp, {
        validators: zod4Client(updateExpenseSchema),
        validationMethod: "oninput",
        invalidateAll: true,
        delayMs: 500,
        onResult: ({ result }) => {
            if (result.type === "success") {
                handleClose();
                toast.success("update Success");
                if (
                    typeof window !== "undefined" &&
                    (window as any).refreshQuickStat
                ) {
                    (window as any).refreshQuickStat();
                }
            } else if (result.type === "failure") {
                handleFailure(result.data, "Update Transaction Failed");
            }
        },
    });

    const { form: formData, enhance, delayed, submitting, reset } = form;

    let nameValue = $state($formData.name ?? "");
    let amountValue = $state<number | undefined>($formData.amount);
    let idValue = $derived.by(() => {
        return $formData.id ?? expense?.id ?? id ?? "";
    });
    $effect(() => {
        $formData.name = nameValue;
        $formData.amount = amountValue;
        $formData.id = idValue;
    });

    const handleClose = () => {
        expenseStore.setIsEdit(false);
        const pathname = page.url.pathname;
        const currentParams = new URLSearchParams(page.url.searchParams);
        currentParams.delete("detailId");
        currentParams.delete("t");
        const queryString = currentParams.toString();
        goto(`${pathname}${queryString ? "?" + queryString : ""}`, {
            replaceState: false,
        });
    };

    const handleCancel = () => {
        reset();
        handleClose();
    };
</script>

<div class="w-full h-full">
    <div
        class="relative bg-white border-2 border-stone-900
           shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
           transition-all duration-200 flex flex-col h-full"
    >
        <!-- Header -->
        <div
            class="bg-stone-900 text-white px-4 py-3 flex justify-between items-center border-b-2 border-stone-900"
        >
            <h2 class="text-lg font-bold">Transaction Update</h2>
            <button
                type="button"
                onclick={handleClose}
                class="p-1 hover:bg-stone-800 transition-colors rounded"
            >
                <X size={20} />
            </button>
        </div>

        {#if isLoading}
            <div class="p-3 flex items-center justify-center">
                <span class="loading loading-spinner loading-xl"></span>
            </div>
        {:else if error}
            <div class="p-3 flex items-center justify-center">
                <p class="text-sm text-red-600">{error}</p>
            </div>
        {:else if expense}
            <div class="w-full">
                <form
                    action="?/update"
                    method="post"
                    use:enhance
                    class="w-full space-y-1"
                >
                    <div class="w-full grid grid-cols-2 gap-2 p-2">
                        <Field {form} name="name">
                            <Control>
                                {#snippet children({ props })}
                                <InputComponent
                                    bind:value={nameValue}
                                    nameField="Name"
                                    placeholder={expense?.name}
                                    {...props}
                                />
                                {/snippet}
                            </Control>
                        </Field>
                        <Field {form} name="amount">
                            <Control>
                                {#snippet children({ props })}
                                <InputComponent
                                    type="number"
                                    bind:value={amountValue}
                                    nameField="Amount"
                                    placeholder={String(expense?.amount || "")}
                                    {...props}
                                />
                                {/snippet}
                            </Control>
                        </Field>
                        <input type="hidden" bind:value={idValue} name="id" />
                    </div>

                    <div class="flex gap-2 p-2">
                        <button
                            class="w-full px-2 py-1.5 bg-stone-900 text-white font-bold text-sm
                               border-2 border-stone-900
                               shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
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
                                    Sending...
                                </span>
                            {:else}
                                Update
                            {/if}
                        </button>
                        <button
                            class="w-full px-1 py-1.5 bg-white text-stone-900 font-bold text-sm
                               border-2 border-stone-900
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
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        {:else}
            <div class="p-3 flex items-center justify-center">
                <p class="text-sm text-stone-600">No data available</p>
            </div>
        {/if}
    </div>
</div>
