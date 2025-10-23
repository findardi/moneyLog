<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
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
    <div></div>
</div>
