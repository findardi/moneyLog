<script lang="ts">
    import { X, Calendar, Tag, DollarSign, Clock } from "@lucide/svelte";
    import { expenseStore } from "$lib/stores/expense.svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import type { expenseDetail } from "$lib/utils/types";

    let expense = $derived(expenseStore.expenseDetail);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    $effect(() => {
        const id = page.url.searchParams.get("detailId");
        if (!id) return;
        
        isLoading = true;
        error = null;
        
        setTimeout(() => {
            fetch(`/api/expense/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch expense detail");
                    return res.json();
                })
                .then(data => {
                    expenseStore.setExpenseDetail(data as expenseDetail);
                    isLoading = false;
                })
                .catch(err => {
                    error = err.message;
                    isLoading = false;
                });
        }, 500);
    });

    // Format currency
    const formatCurrency = (value: number = 0) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    const handleClose = () => {
        expenseStore.setIsDetail(false);
        const pathname = page.url.pathname;
        const currentParams = new URLSearchParams(page.url.searchParams);
        currentParams.delete('detailId');
        currentParams.delete('t');
        const queryString = currentParams.toString();
        goto(`${pathname}${queryString ? '?' + queryString : ''}`, { replaceState: false });
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
            <h2 class="text-lg font-bold">Transaction Details</h2>
            <button
                type="button"
                onclick={handleClose}
                class="p-1 hover:bg-stone-800 transition-colors rounded"
            >
                <X size={20} />
            </button>
        </div>

        <!-- Content -->
        {#if isLoading}
            <div class="p-3 flex items-center justify-center">
                <span class="loading loading-spinner loading-xl"></span>
            </div>
        {:else if error}
            <div class="p-3 flex items-center justify-center">
                <p class="text-sm text-red-600">{error}</p>
            </div>
        {:else if expense}
            <div class="p-3 space-y-2 flex-1">
            <div class="grid grid-cols-2 py-2">
                <div class="space-y-0.5 flex flex-col items-start">
                    <h4 class="text-xs font-bold text-stone-600 uppercase">
                        Name
                    </h4>
                    <p class="text-sm font-bold text-stone-900">
                        {expense?.name}
                    </p>
                </div>

                <!-- Amount -->
                <div class="space-y-0.5 flex flex-col items-start pl-2">
                    <h4 class="text-xs font-bold text-stone-600 uppercase">
                        Amount
                    </h4>
                    <div class="flex items-center gap-2">
                        <p class="text-sm font-bold text-stone-900">
                            {formatCurrency(expense?.amount)}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Category -->
            <div class="space-y-1">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span
                            class="inline-block px-2 py-0.5 text-xs font-bold
                                   bg-stone-900 text-white border-2 border-stone-900"
                        >
                            {expense?.category_name}
                        </span>
                        <div class="flex-grow h-[2px] bg-stone-900"></div>
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-rows-2 gap-4 pl-2 py-2">
                <!-- Spent At -->
                <div class="space-y-1">
                    <div class="flex justify-start">
                        <h4 class="text-xs font-bold text-stone-600 uppercase">
                            Spent At
                        </h4>
                    </div>

                    <div class="flex justify-start gap-2">
                        <p class="text-xs font-medium text-stone-900">
                            {formatDate(expense?.spent_at ?? "")}
                        </p>
                    </div>
                </div>

                <!-- Updated At -->
                <div class="space-y-1">
                    <div class="flex justify-start">
                        <h4 class="text-xs font-bold text-stone-600 uppercase">
                            Last Updated
                        </h4>
                    </div>

                    <div class="flex items-end gap-2">
                        <p class="text-xs font-medium text-stone-900">
                            {formatDate(expense?.updated_at ?? "")}
                        </p>
                    </div>
                </div>
            </div>

            <!-- ID -->
            <div class="space-y-0.5">
                <h4 class="text-xs font-bold text-stone-600 uppercase">
                    Transaction ID
                </h4>
                <p
                    class="text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-200 p-1.5 break-all leading-tight"
                >
                    {expense?.id}
                </p>
            </div>
        </div>
        {:else}
            <div class="p-3 flex items-center justify-center">
                <p class="text-sm text-stone-600">No data available</p>
            </div>
        {/if}
        

        <!-- Footer Actions -->
        <div
            class="px-3 py-2 bg-stone-50 border-t-2 border-stone-200 flex justify-end gap-2 flex-shrink-0"
        >
            <button
                type="button"
                onclick={handleClose}
                class="px-3 py-1.5 text-xs border-2 border-stone-900 bg-white
                       text-stone-900 font-bold cursor-pointer
                       hover:bg-stone-100 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-stone-900
                       shadow-[2px_2px_0px_0px_rgba(41,37,36,0.3)]
                       hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,0.3)]
                       hover:translate-x-[1px] hover:translate-y-[1px]"
            >
                Close
            </button>
        </div>
    </div>
</div>
