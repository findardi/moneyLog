<script lang="ts">
    import type { AlertNotification, ErrorMessage } from '$lib/utils/types';
    import { source } from 'sveltekit-sse';
    import { Pencil, Trash2, Plus } from '@lucide/svelte';
    import ModalDeleteSpendComponent from './ModalDeleteSpendComponent.svelte';
    import CreateSpenComponent from './CreateSpenComponent.svelte';
    import type { SuperValidated } from 'sveltekit-superforms';
    import type { createSpendingLimitDto, updateSpendingLimitDto } from '$lib/schema/spending.schema';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import EditSpenComponent from './EditSpenComponent.svelte';

    let {formCreate, formEdit}: {formCreate:SuperValidated<createSpendingLimitDto>, formEdit:SuperValidated<updateSpendingLimitDto>} = $props()

    let isCreateOpen = $state(false);
    let isEditOpen = $state(false)
    const closeEditModal = () => {
        isEditOpen = false;
    }
    const closeModal = () => {
        isCreateOpen = false;
    }
    const handleCreateSuccess = () => {
        // Reset noBudget state and reconnect SSE
        noBudget = false;
        // Force reconnect by closing and reopening connection
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    const handleUpdateSuccess = () => {
        // Reload page to refresh SSE connection with updated data
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    let isDeleteOpen = $state(false);
    let deleteSpendingId = $state("");
    const openDeleteModal = (id: string) => {
        deleteSpendingId = id;
        isDeleteOpen = true;
    }
    const closeDeleteModal = () => {
        isDeleteOpen = false;
        deleteSpendingId = "";
    }

    let noBudget = $state(false);

    const connection = source('/api/dashboard/alert', {
        close({ connect }) {
            // Only reconnect if not in no_budget state
            if (!noBudget) {
                console.log('SSE disconnected, reconnecting in 3s...');
                setTimeout(() => connect(), 3000);
            } else {
                console.log('No budget limit set, connection closed permanently');
            }
        }
    });

    const connectedData = connection.select('connected').json(
        ({ error, raw, previous }) => {
            if (!raw || raw.trim() === '') return previous;
            console.error('Connected JSON parse error:', error, 'Raw:', raw);
            return previous;
        }
    );

    const notificationData = connection.select('notification').json<AlertNotification>(
        ({ error, raw, previous }) => {
            if (!raw || raw.trim() === '') return previous;
            console.error('Notification JSON parse error:', error, 'Raw:', raw);
            return previous;
        }
    );

    const errorData = connection.select('error').json<ErrorMessage>(
        ({ previous }) => previous
    );

    const noBudgetData = connection.select('no_budget').json<{ message: string }>(
        ({ error, raw, previous }) => {
            if (!raw || raw.trim() === '') return previous;
            console.error('No budget JSON parse error:', error, 'Raw:', raw);
            return previous;
        }
    );

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    $effect(() => {
        if ($connectedData) {
            console.log('✅ Connected:', $connectedData);
        }
    });

    $effect(() => {
        if ($errorData) {
            console.error('❌ SSE Error:', $errorData);
        }
    });

    $effect(() => {
        if ($noBudgetData) {
            console.log('No budget limit:', $noBudgetData);
            noBudget = true;
            connection.close();
        }
    });

    $effect(() => {
        return () => {
            console.log('Component destroyed, closing SSE connection');
            connection.close();
        };
    });

    const handleUpdate = (id:string) => {
        isEditOpen=true
        const pathname = page.url.pathname;
        const currentParam = new URLSearchParams(page.url.searchParams)
        currentParam.set("id", id)
        goto(`${pathname}?${currentParam.toString()}`, { replaceState: true });
    }
</script>

<div class="w-full h-full border-4 border-stone-900 bg-white shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] p-4">
    <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="mb-4">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-stone-900">Spending Alert</h2>
                {#if $notificationData}
                    <div class="flex gap-2">
                        <button 
                            class="p-1.5 border-2 border-stone-900 bg-blue-400 hover:bg-blue-500 transition-colors shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            title="Edit Alert Settings"
                            onclick={() => handleUpdate($notificationData.id)}
                        >
                            <Pencil size={16} class="text-stone-900" />
                        </button>
                        <button 
                            onclick={() => openDeleteModal($notificationData.id)}
                            class="p-1.5 border-2 border-stone-900 bg-red-400 hover:bg-red-500 transition-colors shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            title="Delete Alert"
                        >
                            <Trash2 size={16} class="text-stone-900" />
                        </button>
                    </div>
                {/if}
            </div>
            {#if $notificationData}
                <div class="mt-2 p-3 border-2 border-stone-900 {$notificationData.isAlert ? 'bg-red-100' : 'bg-green-100'}">
                    <p class="text-sm font-semibold text-stone-900">{$notificationData.message}</p>
                </div>
            {/if}
        </div>

        <!-- Progress Bar -->
        {#if $notificationData}
            <div class="space-y-4">
                <!-- Progress Bar -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-stone-700">Progress:</span>
                        <span class="text-xs font-bold {$notificationData.isAlert ? 'text-red-600' : 'text-green-600'}">
                            {$notificationData.currentPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div class="w-full h-8 border-4 border-stone-900 bg-stone-100 relative overflow-hidden">
                        <div 
                            class="h-full transition-all duration-500 {$notificationData.isAlert ? 'bg-red-500' : 'bg-green-500'}"
                            style="width: {Math.min($notificationData.currentPercentage, 100)}%"
                        ></div>
                        <!-- Alert threshold marker -->
                        <div 
                            class="absolute top-0 bottom-0 w-1 bg-yellow-500 border-l-2 border-r-2 border-stone-900"
                            style="left: {$notificationData.alertPercentage}%"
                        ></div>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="font-bold text-stone-600">{formatCurrency($notificationData.currentSpending)}</span>
                        <span class="font-bold text-yellow-600">Alert: {$notificationData.alertPercentage}%</span>
                        <span class="font-bold text-stone-900">{formatCurrency($notificationData.maxSpending)}</span>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Error State -->
        {#if $errorData}
            <div class="mt-3 p-3 border-2 border-red-600 bg-red-50">
                <p class="text-xs font-bold text-red-600">⚠️ {$errorData.message}</p>
            </div>
        {/if}

        <!-- No Budget State -->
        {#if $noBudgetData}
            <div class="flex flex-col space-y-3">
                <p class="text-sm text-stone-600">
                    {$noBudgetData.message || 'No budget limit configured. Create one to track spending.'}
                </p>
                <button 
                    class="px-4 py-2 border-2 border-stone-900 bg-green-400 hover:bg-green-500 transition-colors shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[1px_1px_0px_0px_rgba(41,37,36,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-bold text-sm text-stone-900 flex items-center gap-2 w-fit"
                    onclick={() => {
                        isCreateOpen=true
                    }}
                >
                    <Plus size={16} />
                    Create Budget Limit
                </button>
            </div>
        {/if}

        <!-- Loading State -->
        {#if !$notificationData && !$errorData && !$noBudgetData}
            <div class="mt-3 p-3 border-2 border-stone-900 bg-stone-50">
                <p class="text-xs font-bold text-stone-600">⏳ Waiting for data...</p>
            </div>
        {/if}
    </div>
</div>

<CreateSpenComponent bind:isOpen={isCreateOpen} onClose={closeModal} form={formCreate} onSuccess={handleCreateSuccess}/>

<ModalDeleteSpendComponent bind:isOpen={isDeleteOpen} onClose={closeDeleteModal} spendingId={deleteSpendingId}/>

<EditSpenComponent bind:isOpen={isEditOpen} onClose={closeEditModal} form={formEdit} onSuccess={handleUpdateSuccess}/>