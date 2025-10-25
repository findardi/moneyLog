<script lang="ts">
    import { goto as navigate } from "$app/navigation";
    import { page } from "$app/state";
    import { expenseStore } from "$lib/stores/expense.svelte";
    import CardHistory from "./CardHistory.svelte";
    import SearchComponent from "./SearchComponent.svelte";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";

    const formatCurrency = (value: number = 0) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    let currentOffset = $derived(
        parseInt(page.url.searchParams.get("offset") || "0"),
    );
    const limit = 5;
    let currentPage = $derived(Math.floor(currentOffset / limit) + 1);

    const prevPage = () => {
        const newOffset = Math.max(0, currentOffset - limit);
        updateUrl(newOffset);
    };

    const nextPage = () => {
        const newOffset = currentOffset + limit;
        updateUrl(newOffset);
    };

    const updateUrl = (newOffset: number) => {
        const params = new URLSearchParams(page.url.searchParams);
        if (newOffset === 0) {
            params.delete("offset");
        } else {
            params.set("offset", newOffset.toString());
        }

        const queryString = params.toString();
        const newUrl = queryString
            ? `${page.url.pathname}?${queryString}`
            : page.url.pathname;
        navigate(newUrl);
    };
</script>

<div class="w-full max-w-4xl">
    <div
        class="relative bg-white border-3 border-stone-900
           shadow-[2px_4px_0px_0px_rgba(41,37,36,1)]
           transition-all duration-200 rounded-lg overflow-hidden"
    >
        <!-- header -->
        <div
            class="flex items-center justify-between p-3 md:p-4 border-b-2 border-stone-900"
        >
            <SearchComponent />
        </div>

        <!-- content -->
        <div class="p-4 md:p-6">
            <!-- Total Expense -->
            <div
                class="mb-4 p-4 bg-stone-900 border-2 border-stone-900
                       shadow-[2px_2px_0px_0px_rgba(41,37,36,0.3)]"
            >
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-white uppercase"
                        >Total Expense</span
                    >
                    <span class="text-lg font-bold text-white">
                        {formatCurrency(expenseStore.totalExpense)}
                    </span>
                </div>
            </div>

            <!-- Transaction List -->
            <div class="space-y-0.5 mb-4">
                {#if expenseStore.expenses.length === 0}
                    <div class="text-center text-stone-600 py-8 font-bold" >
                        No transactions found
                    </div>
                {:else}
                    {#each expenseStore.expenses.slice(0, 5) as expense (expense.id)}
                        <CardHistory
                            id={expense.id}
                            name={expense.name}
                            category={expense.category}
                            amount={expense.amount}
                            spentAt={new Date(expense.spentAt)}
                        />
                    {/each}
                {/if}
            </div>

            <!-- Pagination -->
            <div
                class="flex items-center justify-between p-3 border-2 border-stone-900
                       bg-stone-50"
            >
                <button
                    type="button"
                    onclick={prevPage}
                    disabled={currentOffset === 0}
                    class="px-3 py-1.5 text-sm border-2 border-stone-900 bg-white
                           text-stone-900 font-bold cursor-pointer
                           hover:bg-stone-100 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-stone-900
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-1
                           shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                           hover:shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                           hover:translate-x-[-1px] hover:translate-y-[-1px]
                           disabled:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                           disabled:translate-x-0 disabled:translate-y-0"
                >
                    <ChevronLeft size={16} />
                    Prev
                </button>

                <div class="text-sm font-bold text-stone-900">
                    Page {expenseStore.meta.page} of {expenseStore.meta
                        .totalPages}
                </div>

                <button
                    type="button"
                    onclick={nextPage}
                    disabled={currentPage >= expenseStore.meta.totalPages}
                    class="px-3 py-1.5 text-sm border-2 border-stone-900 bg-white
                           text-stone-900 font-bold cursor-pointer
                           hover:bg-stone-100 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-stone-900
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-1
                           shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                           hover:shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                           hover:translate-x-[-1px] hover:translate-y-[-1px]
                           disabled:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)]
                           disabled:translate-x-0 disabled:translate-y-0"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    </div>
</div>
