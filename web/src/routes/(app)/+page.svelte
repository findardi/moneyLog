<script lang="ts">
    import { page } from "$app/state";
    import BannerComponent from "$lib/components/app/BannerComponent.svelte";
    import HomePageComponent from "$lib/components/app/HomePageComponent.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const username = $derived(page.data.username || undefined);
</script>

<div class="w-full h-full flex items-center justify-center">
    {#if username}
        <HomePageComponent form={data.activationForm} />
    {:else}
        <BannerComponent />
    {/if}
</div>
