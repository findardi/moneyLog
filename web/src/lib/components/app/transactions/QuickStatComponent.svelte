<script lang="ts">
    import { expenseStore } from "$lib/stores/expense.svelte";
    import { formatCurrency } from "$lib/utils/common/format";
    import type { topExpense } from "$lib/utils/types";
    import { X, Tag } from "@lucide/svelte";

    let topExpenseData = $derived(expenseStore.topExpense);
    let isLoading = $state<boolean>(false);
    let error = $state<string | null>(null);
    let refreshTrigger = $state(0);

    const fetchTopExpenses = async () => {
        isLoading = true;
        error = null;

        try {
            const res = await fetch("/api/expense");
            if (!res.ok) throw new Error("Failed to fetch top expenses");
            const data = await res.json();
            expenseStore.setTopExpense(data as topExpense[]);
        } catch (err) {
            error = err instanceof Error ? err.message : "An error occurred";
        } finally {
            isLoading = false;
        }
    };

    $effect(() => {
        refreshTrigger;
        fetchTopExpenses();
    });

    if (typeof window !== "undefined") {
        (window as any).refreshQuickStat = () => {
            refreshTrigger++;
        };
    }
</script>

<div class="w-full h-full">
    <div
        class="relative bg-white border-2 border-stone-900
			shadow-[3px_3px_0_0_rgba(41,37,36,1)]
			transition-all duration-200 flex flex-col h-full"
    >
        <!-- Header -->
        <div
            class="bg-stone-900 text-white px-3 py-2 flex justify-between items-center border-b-2 border-stone-900"
        >
            <h2 class="text-sm font-bold">Top Expense Categories</h2>
        </div>

        <!-- Content -->
        <div class="p-3 flex flex-col gap-2">
            {#if isLoading}
                <span class="loading loading-spinner loading-md"></span>
            {:else if error}
                <p class="text-red-600">{error}</p>
            {:else if topExpenseData.length > 0}
                {#each topExpenseData as cat, i}
                    <div
                        class="flex items-center justify-between border-2 border-stone-900 rounded-md px-2 py-1.5 bg-stone-50 shadow-[2px_2px_0_0_rgba(41,37,36,1)]"
                    >
                        <div class="flex items-center gap-1.5">
                            <Tag size={12} class="text-stone-700" />
                            <span class="font-semibold text-xs text-stone-800">
                                {i + 1}. {cat.name}
                            </span>
                        </div>
                        <div class="flex items-center gap-1 text-stone-700">
                            <span class="font-semibold text-xs"
                                >{formatCurrency(cat.amount || 0)}</span
                            >
                            <span class="text-[10px] text-stone-500"
                                >({cat.total}x)</span
                            >
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="text-center text-stone-600 py-8 font-bold">
                    No Top Expense Found
                </div>
            {/if}
        </div>
    </div>
</div>
