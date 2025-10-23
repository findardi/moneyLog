<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import SidebarComponent from "$lib/components/app/SidebarComponent.svelte";
    import type { LayoutData } from "./$types";

    let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<div
    class="min-h-screen w-full flex items-center justify-center bg-amber-50 p-2 md:p-4"
>
    {#if data.username}
        <div
            class="w-full max-w-7xl h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)]"
        >
            <div
                class="grid lg:grid-cols-5 items-stretch grid-cols-1 gap-0 h-full"
            >
                <!-- Sidebar -->
                <div
                    class="hidden lg:flex order-1 bg-white border-3 border-stone-900
                           shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
                           overflow-hidden"
                >
                    <div class="w-full h-full">
                        <SidebarComponent userActive={data.isActive} />
                    </div>
                </div>

                <!-- Main Content -->
                <div
                    class="flex order-2 col-span-4 bg-white border-0 lg:border-3 lg:border-l-0
                           lg:border-stone-900 lg:shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
                           overflow-hidden"
                >
                    <div
                        class="hidden lg:block w-[3px] bg-stone-900 flex-shrink-0"
                    ></div>
                    <div class="flex w-full h-full overflow-auto">
                        <div class="w-full p-4 md:p-6">
                            {@render children()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div
            class="w-full max-w-7xl h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)]"
        >
            {@render children()}
        </div>
    {/if}
</div>

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
