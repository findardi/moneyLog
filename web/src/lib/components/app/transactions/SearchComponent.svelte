<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { Search, History, X } from "@lucide/svelte";

    // Categories untuk search by
    let searchCategories = [
        { label: "Category", value: "category" },
        { label: "Name", value: "name" },
    ];

    // Categories untuk order by
    let orderByCategories = [
        { label: "Created At", value: "createdAt" },
        { label: "Name", value: "name" },
    ];

    let categoriesSelect = [
        "Food & Drinks",
        "Tickets",
        "Shopping",
        "Health",
        "Entertainment",
        "Education",
        "Electricity & Water",
        "House",
        "Debt",
        "Insurance",
    ];

    let selectedCategory = $derived(
        page.url.searchParams.get("search_category") || "",
    );
    let orderBy = $derived(page.url.searchParams.get("order_by") || "");
    let sortOrder = $derived(page.url.searchParams.get("sort") || "");
    let searchValue = $derived(page.url.searchParams.get("search") || "");

    let searchPlaceholder = $derived(
        selectedCategory
            ? `Search ${selectedCategory.replace("_", " ")}...`
            : "Search...",
    );

    // Function to reset all filters
    function resetFilters() {
        goto(page.url.pathname);
    }

    // Check if any filter is active
    let hasActiveFilters = $derived(
        !!(selectedCategory || orderBy || sortOrder || searchValue),
    );
</script>

<div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
    <div class="order-1 hidden lg:flex justify-start items-center">
        <div
            class="flex items-center gap-2 bg-white px-4 py-2 rounded-md border-2 border-stone-900
                    shadow-[2px_2px_0px_0px_rgba(41,37,36,0.3)]"
        >
            <History size={24} class="text-stone-900" strokeWidth={2.5} />
            <span class="text-lg font-bold text-stone-900">History</span>
        </div>
    </div>

    <div class="order-2 flex justify-end col-span-2">
        <form method="GET" class="flex flex-wrap gap-2">
            <!-- Category Select -->
            <div class="flex flex-col space-y-2">
                <div class="flex space-x-2">
                    <div class="relative">
                        <select
                            name="search_category"
                            bind:value={selectedCategory}
                            class="px-2 py-1 text-sm border-2 border-stone-900 bg-white
							font-medium text-stone-900 cursor-pointer
							hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900
							transition-colors appearance-none pr-6 rounded-md"
                        >
                            <option disabled selected value="">Search By</option
                            >
                            {#each searchCategories as item}
                                <option value={item.value}>{item.label}</option>
                            {/each}
                        </select>
                        <!-- custom caret -->
                        <div
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none"
                        >
                            ▼
                        </div>
                    </div>

                    <!-- Order By Select -->
                    <div class="relative">
                        <select
                            name="order_by"
                            bind:value={orderBy}
                            class="px-2 py-1 text-sm border-2 border-stone-900 bg-white
							font-medium text-stone-900 cursor-pointer
							hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900
							transition-colors appearance-none pr-6 rounded-md"
                        >
                            <option disabled selected value="">Order by</option>
                            {#each orderByCategories as item}
                                <option value={item.value}>{item.label}</option>
                            {/each}
                        </select>
                        <!-- custom caret -->
                        <div
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none"
                        >
                            ▼
                        </div>
                    </div>

                    <!-- Sort Select -->
                    <div class="relative">
                        <select
                            name="sort"
                            bind:value={sortOrder}
                            class="px-2 py-1 text-sm border-2 border-stone-900 bg-white
							font-medium text-stone-900 cursor-pointer
							hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900
							transition-colors appearance-none pr-6 rounded-md"
                        >
                            <option disabled selected value="">Sort</option>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <!-- custom caret -->
                        <div
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none"
                        >
                            ▼
                        </div>
                    </div>
                </div>
                <div class="flex space-x-1">
                    <!-- Dynamic Search Input Based on Selected Category -->
                    {#if selectedCategory === "category"}
                        <!-- Category Select Dropdown -->
                        <div class="relative">
                            <select
                                name="search"
                                bind:value={searchValue}
                                class="px-2 py-1 text-sm border-2 border-stone-900 bg-white
                                font-medium text-stone-900 cursor-pointer
                                hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900
                                transition-colors appearance-none pr-6 rounded-md"
                            >
                                <option disabled selected value=""
                                    >Select Category</option
                                >
                                {#each categoriesSelect as category}
                                    <option value={category}>{category}</option>
                                {/each}
                            </select>
                            <!-- custom caret -->
                            <div
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-stone-700 pointer-events-none"
                            >
                                ▼
                            </div>
                        </div>
                    {:else if selectedCategory === "name"}
                        <!-- Text Input for Name -->
                        <input
                            type="text"
                            name="search"
                            bind:value={searchValue}
                            placeholder="Enter name..."
                            class="px-2 py-1 text-sm border-2 border-stone-900 bg-white
                                font-medium text-stone-900 placeholder:text-stone-400
                                focus:outline-none focus:ring-2 focus:ring-stone-900
                                transition-all rounded-md"
                        />
                    {/if}

                    <button
                        type="submit"
                        class="px-3 py-1 text-sm border-2 border-stone-900 bg-stone-900
						text-white font-bold cursor-pointer
						hover:bg-stone-800 transition-colors
						focus:outline-none focus:ring-2 focus:ring-stone-900
						shadow-[2px_2px_0px_0px_rgba(41,37,36,0.3)]
						hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,0.3)]
						hover:translate-x-[1px] hover:translate-y-[1px]
						flex items-end gap-1 rounded-md"
                    >
                        <Search size={16} />
                        Search
                    </button>

                    {#if hasActiveFilters}
                        <button
                            type="button"
                            onclick={resetFilters}
                            class="px-3 py-1 text-sm border-2 border-stone-900 bg-white
                            text-stone-900 font-bold cursor-pointer
                            hover:bg-stone-100 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-stone-900
                            shadow-[2px_2px_0px_0px_rgba(41,37,36,0.3)]
                            hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,0.3)]
                            hover:translate-x-[1px] hover:translate-y-[1px]
                            flex items-end gap-1 rounded-md"
                        >
                            <X size={16} />
                            Reset
                        </button>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</div>

<style>
    select {
        /* hilangin default caret */
        background-image: none;
    }
    option {
        background-color: white;
        color: #292524;
    }
    select:focus {
        outline: none;
    }
</style>
