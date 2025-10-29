<script lang="ts">
    import {
        handleBackdropClick,
        handleKeydown,
    } from "$lib/utils/common/handle";
    import { X, AlertTriangle } from "@lucide/svelte";

    interface Props {
        isOpen?: boolean;
        onClose?: () => void;
        itemName?: string;
        itemId?: string;
        isLoading?: boolean;
    }

    let {
        isOpen = $bindable(false),
        onClose = () => {},
        itemName = "this item",
        itemId = "qq",
        isLoading = false,
    }: Props = $props();
</script>

<svelte:window onkeydown={(e) => handleKeydown(e, onClose, isOpen)} />

{#if isOpen}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={(e) => handleBackdropClick(e, onClose)}
        role="presentation"
    >
        <div
            class="bg-white border-3 border-stone-900
                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                   max-w-md w-full rounded-lg overflow-hidden
                   animate-in fade-in zoom-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                class="flex items-center justify-between p-4 border-b-2 border-stone-900 bg-stone-50"
            >
                <div class="flex items-center gap-2">
                    <div
                        class="p-1.5 bg-red-500 border-2 border-stone-900 rounded"
                    >
                        <AlertTriangle
                            size={20}
                            class="text-white"
                            strokeWidth={2.5}
                        />
                    </div>
                    <h2
                        id="modal-title"
                        class="text-lg font-black text-stone-900"
                    >
                        Delete Confirmation
                    </h2>
                </div>
                <button
                    type="button"
                    onclick={onClose}
                    disabled={isLoading}
                    class="p-1 hover:bg-stone-200 rounded transition-colors
                           focus:outline-none focus:ring-2 focus:ring-stone-900
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close modal"
                >
                    <X size={20} class="text-stone-900" strokeWidth={2.5} />
                </button>
            </div>

            <div class="p-6">
                <p class="text-stone-900 font-medium text-base">
                    Are you sure you want to delete <strong class="font-bold"
                        >"{itemName}"</strong
                    >?
                </p>
                <p class="text-stone-600 text-sm mt-2">
                    This action cannot be undone. The transaction will be
                    permanently removed from your records.
                </p>
            </div>

            <form action="?/delete" method="post">
                <input type="text" value={itemId} name="id" hidden />
                <div
                    class="flex gap-2 p-4 border-t-2 border-stone-900 bg-stone-50"
                >
                    <button
                        type="button"
                        onclick={onClose}
                        disabled={isLoading}
                        class="flex-1 px-4 py-2.5 text-sm border-2 border-stone-900 bg-white
                               text-stone-900 font-bold cursor-pointer
                               hover:bg-stone-100 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-stone-900
                               disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-1px] hover:translate-y-[-1px]
                               active:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                               active:translate-x-[1px] active:translate-y-[1px]
                               disabled:shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                               disabled:translate-x-0 disabled:translate-y-0
                               rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="flex-1 px-4 py-2.5 text-sm border-2 border-stone-900 bg-red-500
                               text-white font-bold cursor-pointer
                               hover:bg-red-600 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-stone-900
                               disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-1px] hover:translate-y-[-1px]
                               active:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                               active:translate-x-[1px] active:translate-y-[1px]
                               disabled:shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                               disabled:translate-x-0 disabled:translate-y-0
                               rounded flex items-center justify-center gap-2"
                    >
                        {#if isLoading}
                            <span
                                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                            ></span>
                            Deleting...
                        {:else}
                            Delete
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
