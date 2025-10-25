<script lang="ts">
    import { insertExpenseSchema, type insertExpenseDTO, categoryEnum, type Category, type insertMultipleExpenseDTO, insertMultipleExpenseSchema } from "$lib/schema/expense.schema";
    import { Control, Field, FieldErrors, Label } from "formsnap";
    import { toast } from "svelte-sonner";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import type { ApiErrorResponse } from "$lib/utils/api-response.types";
    import { Minus, Plus, Camera } from "@lucide/svelte";

    interface insertProps{
        form?: SuperValidated<insertMultipleExpenseDTO>;
        actions?: string;
        isOpen?: boolean;
        onClose?: () => void;
        isLoading?: boolean;
    }

    let {form: formProp, actions="",isOpen = $bindable(false), onClose = () => {}, isLoading= false}: insertProps = $props()

    const form = superForm(formProp!, {
        validators: zod4Client(insertMultipleExpenseSchema),
        validationMethod: "onblur",
        resetForm:true,
        invalidateAll: true,
        dataType: "json",
        delayMs:500,
        onResult: ({result}) => {
            if (result.type === "success") {
                toast.success("Transaction Added Successfully");
                reset();
                onClose();
                if (typeof window !== 'undefined' && (window as any).refreshQuickStat) {
                    (window as any).refreshQuickStat();
                }
            } else if (result.type === "failure") {
                handleInsertFailure(result.data);
            }
        },
    })

    const {form: formData, enhance, submitting, reset} = form;
    
    const addItem = () => {
        $formData.items = [
            ...$formData.items,
            {
                name: "",
                amount: 0,
                category: ""
            }
        ]
    }

    const removeItem = (index: number) => {
        $formData.items = $formData.items.filter((_, i) => i !== index)
    }

    const categories = categoryEnum.options;

    function handleInsertFailure(data: any) {
        if (data?.apiError) {
            const apiError = data.apiError as ApiErrorResponse;
            toast.error(apiError.message, {
                duration: 5000,
            });
            return;
        }

        let errorMessage = "Failed to add transaction";
        if (typeof data?.message === "string") {
            errorMessage = data.message;
        } else if (data?.form?.message) {
            errorMessage = data.form.message;
        }
        toast.error(errorMessage);
    }

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

<svelte:window onkeydown={handleKeydown}/>

{#if isOpen}
    <div
        class="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={handleBackdropClick}
        role="presentation"
    >
        <div class="bg-white border-3 border-stone-900 shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] w-full max-w-5xl p-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-stone-900 uppercase tracking-wide">Add Transaction</h2>
            </div>

            <form method="post" action="?/insert" use:enhance class="w-full space-y-5">
                <!-- All fields in a single horizontal row -->
                 {#each $formData.items as item, index (index)}
                    <div class="space-y-2">
                        <div class="flex gap-4 items-start">
                            <Field {form} name="items[{index}].name" >
                                <Control>
                                    {#snippet children({ props })}
                                        <div class="relative">
                                            <input
                                                type="text"
                                                class="w-full px-4 py-3 border-3 border-stone-900
                                                       focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                                       transition-all duration-200 font-medium
                                                       placeholder:text-stone-400"
                                                placeholder="Coffee, Lunch, etc."
                                                {...props}
                                                bind:value={$formData.items[index].name}
                                            />
                                            <span class="absolute top-1 left-2 text-[10px] font-bold text-stone-500 uppercase tracking-wide">Name</span>
                                        </div>
                                    {/snippet}
                                </Control>
                                <FieldErrors class="mt-1 text-xs font-bold text-red-600" />
                            </Field>

                            <Field {form} name="items[{index}].amount" >
                                <Control>
                                    {#snippet children({ props })}
                                        <div class="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                class="w-full px-4 py-3 border-3 border-stone-900
                                                       focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                                       transition-all duration-200 font-medium
                                                       placeholder:text-stone-400"
                                                placeholder="0.00"
                                                {...props}
                                                bind:value={$formData.items[index].amount}
                                            />
                                            <span class="absolute top-1 left-2 text-[10px] font-bold text-stone-500 uppercase tracking-wide">Amount</span>
                                        </div>
                                    {/snippet}
                                </Control>
                                <FieldErrors class="mt-1 text-xs font-bold text-red-600" />
                            </Field>

                            <Field {form} name="items[{index}].category" >
                                <Control>
                                    {#snippet children({ props })}
                                        <div class="relative">
                                            <select
                                                class="w-full px-4 py-3 border-3 border-stone-900
                                                       focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                                       transition-all duration-200 font-medium
                                                       bg-white appearance-none"
                                                {...props}
                                                bind:value={$formData.items[index].category}
                                            >
                                                <option value="">Select a category</option>
                                                {#each categories as category}
                                                    <option value={category}>{category}</option>
                                                {/each}
                                            </select>
                                            <span class="absolute top-1 left-2 text-[10px] font-bold text-stone-500 uppercase tracking-wide pointer-events-none">Category</span>
                                        </div>
                                    {/snippet}
                                </Control>
                                <FieldErrors class="mt-1 text-xs font-bold text-red-600" />
                            </Field>

                            <div class="flex flex-col gap-2">
                                <button
                                    class="px-4 py-3 bg-red-600 text-white font-bold
                                           border-3 border-stone-900
                                           shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                           hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                           hover:translate-x-[-2px] hover:translate-y-[-2px]
                                           transition-all duration-200
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                           disabled:hover:translate-x-0 disabled:hover:translate-y-0
                                           flex items-center justify-center"
                                    type="button"
                                    disabled={$formData.items.length === 1}
                                    onclick={() => removeItem(index)}
                                >
                                    <Minus size={16}/>
                                </button>
                                
                                
                            </div>
                        </div>
                    </div>
                 {/each}

                 <div class="flex flex-row gap-4 justify-end items-center">
                    <button
                        class="px-4 py-3 bg-stone-900 text-white font-bold
                               border-3 border-stone-900
                               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               disabled:hover:translate-x-0 disabled:hover:translate-y-0
                               flex items-center justify-center"
                        type="button"
                        disabled={$formData.items.length >= 5}
                        onclick={() => addItem()}
                    >
                        <Plus size={16}/>
                    </button>
                    <button
                        class="px-4 py-3 bg-stone-900 text-white font-bold
                               border-3 border-stone-900
                               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               disabled:hover:translate-x-0 disabled:hover:translate-y-0
                               flex items-center justify-center tooltip"
                        type="button"
                        data-tip="insert by image"
                        onclick={() => {}}
                    >
                        <Camera size={16}/>
                    </button>
                </div>
                <!-- Action buttons -->
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
                            <span class="flex items-center justify-center gap-2">
                                <span class="loading loading-spinner loading-sm"></span>
                                Adding...
                            </span>
                        {:else}
                            Add Transaction
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