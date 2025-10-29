<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { Search, History, X } from "@lucide/svelte";
    import SelectComponent from "$lib/components/form/SelectComponent.svelte";
    import InputComponent from "$lib/components/form/InputComponent.svelte";

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

    let selectedCategory = $state(page.url.searchParams.get("search_category") || "");
    let orderBy = $state(page.url.searchParams.get("order_by") || "");
    let sortOrder = $state(page.url.searchParams.get("sort") || "");
    let searchValue = $state(page.url.searchParams.get("search") || "");

    let sortOptions = [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
    ];

    function resetFilters() {
        selectedCategory = "";
        orderBy = "";
        sortOrder = "";
        searchValue = "";
        goto(page.url.pathname);
    }

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
                    <div class="w-32">
                        <SelectComponent
                            data={searchCategories}
                            bind:value={selectedCategory}
                            searchable={false}
                            clearable={true}
                            nameField="Search By"
                        />
                        <input type="hidden" name="search_category" value={selectedCategory} />
                    </div>

                    <!-- Order By Select -->
                    <div class="w-36">
                        <SelectComponent
                            data={orderByCategories}
                            bind:value={orderBy}
                            nameField="Order by"
                            searchable={false}
                            clearable={true}
                        />
                        <input type="hidden" name="order_by" value={orderBy} />
                    </div>

                    <!-- Sort Select -->
                    <div class="w-36">
                        <SelectComponent
                            data={sortOptions}
                            bind:value={sortOrder}
                            nameField="Sort"
                            searchable={false}
                            clearable={true}
                        />
                        <input type="hidden" name="sort" value={sortOrder} />
                    </div>
                </div>
                <div class="flex space-x-1">
                    <!-- Dynamic Search Input Based on Selected Category -->
                    {#if selectedCategory === "category"}
                        <!-- Category Select Dropdown -->
                        <div class="w-48">
                            <SelectComponent
                                data={categoriesSelect}
                                bind:value={searchValue}
                                nameField="Select Category"
                                searchable={true}
                                clearable={true}
                            />
                            <input type="hidden" name="search" value={searchValue} />
                        </div>
                    {:else if selectedCategory === "name"}
                        <!-- Text Input for Name -->
                        <div class="w-48">
                            <InputComponent
                                name="search"
                                bind:value={searchValue}
                                nameField="name"
                                placeholder="Enter name..."
                            />
                        </div>
                    {/if}

                    <button
                        type="submit"
                        class="px-4 py-3 text-sm border-3 border-stone-900 bg-stone-900
						text-white font-bold cursor-pointer
						hover:bg-stone-800 transition-colors
						focus:outline-none
						shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
						hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
						hover:translate-x-[-1px] hover:translate-y-[-1px]
						flex items-center gap-1"
                    >
                        <Search size={16} />
                        Search
                    </button>

                    {#if hasActiveFilters}
                        <button
                            type="button"
                            onclick={resetFilters}
                            class="px-4 py-3 text-sm border-3 border-stone-900 bg-white
                            text-stone-900 font-bold cursor-pointer
                            hover:bg-stone-100 transition-colors
                            focus:outline-none
                            shadow-[2px_2px_0px_0px_rgba(41,37,36,1)]
                            hover:shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                            hover:translate-x-[-1px] hover:translate-y-[-1px]
                            flex items-center gap-1"
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

