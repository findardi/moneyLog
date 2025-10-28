<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import AlertDashComponent from "$lib/components/app/dashboard/AlertDashComponent.svelte";
    import type { PageProps } from "./$types";
    let {data}: PageProps= $props();
</script>

<div class="flex flex-col space-y-2">
    <!-- navbar -->
    <div class="flex space-x-2">
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
    </div>
    <!-- content -->
    <div class="w-full h-full flex items-center justify-center">
        <div class="w-full max-w-5xl">
            <div class="grid grid-rows-3 gap-3 space-y-2">
                <!-- alert notification -->
                <div class="w-full h-full py-1.5">
                    <AlertDashComponent formCreate={data.spendingCreate} formEdit={data.spendingUpdate}/>
                </div>
                <!-- dashboard components -->
                <div class=" row-span-2"></div>
            </div>
        </div>
    </div>
</div>
