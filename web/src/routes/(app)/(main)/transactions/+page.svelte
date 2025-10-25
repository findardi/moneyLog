<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { expenseStore } from "$lib/stores/expense.svelte";
    import HistoryTrxComponent from "$lib/components/app/transactions/HistoryTrxComponent.svelte";
    import DetailTrxComponent from "$lib/components/app/transactions/DetailTrxComponent.svelte";
    import EditTrxComponent from "$lib/components/app/transactions/EditTrxComponent.svelte";
    import QuickStatComponent from "$lib/components/app/transactions/QuickStatComponent.svelte";
    import CreateTrxComponent from "$lib/components/app/transactions/CreateTrxComponent.svelte";

    let { data } = $props();

    let isInsertOpen = $state(false);
    const closeModal = () => {
        isInsertOpen = false;
    };

    $effect(() => {
        expenseStore.setData(data);
    });
</script>

<div class="flex flex-col space-y-2">
    <!-- navbar -->
    <div class="flex space-x-2 items-center">
        <div>
            <button
                class="{page.url.pathname !== '/'
                    ? 'flex'
                    : 'hidden'} px-4 py-2.5 font-bold text-sm border-3 border-stone-900 transition-all duration-200 block bg-white text-stone-900 shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                type="button"
                onclick={() => {
                    goto("/");
                }}>Home</button
            >
        </div>
        <div>
            <button
                class="{page.url.pathname !== '/'
                    ? 'flex'
                    : 'hidden'} px-4 py-2.5 font-bold text-sm border-3 border-stone-900 transition-all duration-200 block bg-stone-900 text-white shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                type="button"
                onclick={() => {
                    isInsertOpen = true;
                }}>Insert</button
            >
        </div>
        <div class="flex-grow h-[4px] bg-stone-900"></div>
    </div>
    <!-- content -->
    <div class="w-full h-full flex items-center justify-center">
        <div class="w-full max-w-5xl">
            <div class="grid lg:grid-cols-3 gap-6 py-2 items-start">
                <div class="order-2 flex flex-col h-full min-h-[600px]">
                    <div class="sticky top-0 z-10 bg-white">
                        <QuickStatComponent/>
                    </div>
                    <div class="divider"></div>
                    <div class="mb-auto overflow-y-auto">
                        {#if expenseStore.isDetail}
                            <DetailTrxComponent />
                        {:else if expenseStore.isEdit}  
                            <EditTrxComponent form={data.updateExpenseform} />
                        {/if}
                    </div>
                </div>

                <div class="order-1 col-span-2 self-start">
                    <HistoryTrxComponent />
                </div>
            </div>
        </div>
    </div>
</div>

<CreateTrxComponent bind:isOpen={isInsertOpen} onClose={closeModal} form={data.insertExpenseForm}/> 