<script lang="ts">
    import { Trash2, Edit, Eye } from "@lucide/svelte";
    import ModalDeleteTrxComponent from "./ModalDeleteTrxComponent.svelte";
    import { expenseStore } from "$lib/stores/expense.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    interface cardProps {
        id?: string;
        name?: string;
        amount?: number;
        category?: string;
        spentAt?: Date;
    }

    let { id, name, amount, category, spentAt }: cardProps = $props();

    // Format currency
    const formatCurrency = (value: number = 0) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Format date
    const formatDate = (date?: Date) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    let isModalOpen = $state(false);
    let selectedItem = $state({ id: "", name: "" });
    let isDeleting = $state(false);

    const handleDelete = (id: string, name: string) => {
        selectedItem = { id, name };
        isModalOpen = true;
    };

    const closeModal = () => {
        if (!isDeleting) {
            isModalOpen = false;
            selectedItem = { id: "", name: "" };
        }
    };

    const detail = (id: string) => {
        expenseStore.setIsDetail(true);
        const pathname = page.url.pathname;
        const currentParams = new URLSearchParams(page.url.searchParams);
        currentParams.set('detailId', id);
        currentParams.set('t', Date.now().toString());
        goto(`${pathname}?${currentParams.toString()}`, { replaceState: true });
    };

    const edit = (id: string) => {
        expenseStore.setIsEdit(true);
        const pathname = page.url.pathname;
        const currentParams = new URLSearchParams(page.url.searchParams);
        currentParams.set('detailId', id);
        currentParams.set('t', Date.now().toString());
        goto(`${pathname}?${currentParams.toString()}`, { replaceState: true });
    };
</script>

<div
    class="w-full bg-white border-2 border-stone-900
           hover:bg-stone-50 transition-colors duration-150"
>
    <div class="grid grid-cols-12 gap-2 p-3 items-center">
        <!-- Name -->
        <div class="col-span-5 md:col-span-4">
            <p class="text-sm font-bold text-stone-900 truncate">
                {name || "Unnamed"}
            </p>
        </div>

        <!-- Category -->
        <div class="col-span-3 md:col-span-3">
            <span
                class="inline-block px-2 py-0.5 text-xs font-bold
                       bg-stone-900 text-white border border-stone-900 truncate"
            >
                {category || "-"}
            </span>
        </div>

        <!-- Amount -->
        <div class="col-span-4 md:col-span-3 text-right mr-2">
            <p class="text-sm font-bold text-stone-900 truncate">
                {formatCurrency(amount)}
            </p>
        </div>

        <!-- Actions -->
        <div class="col-span-12 md:col-span-2 flex gap-1 justify-end">
            <button
                type="button"
                onclick={() => edit(id || "")}
                class="p-1.5 border-2 border-stone-900 bg-white
                       text-stone-900 cursor-pointer
                       hover:bg-stone-100 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-stone-900 tooltip"
                data-tip="Edit"
            >
                <Edit size={12} />
            </button>

            <button
                type="button"
                onclick={() => handleDelete(id || "", name || "")}
                class="p-1.5 border-2 border-red-600 bg-red-600
                       text-white cursor-pointer
                       hover:bg-red-700 hover:border-red-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-red-600 tooltip"
                data-tip="Delete"
            >
                <Trash2 size={12} />
            </button>

            <button
                type="button"
                onclick={() => detail(id || "")}
                class="p-1.5 border-2 border-stone-900 bg-stone-900
                       text-white cursor-pointer
                       hover:bg-stone-800 hover:border-stone-800 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-stone-900 tooltip"
                data-tip="Detail"
            >
                <Eye size={12} />
            </button>
        </div>
    </div>
</div>

<ModalDeleteTrxComponent
    bind:isOpen={isModalOpen}
    onClose={closeModal}
    itemName={selectedItem.name}
    itemId={selectedItem.id}
    isLoading={isDeleting}
/>
