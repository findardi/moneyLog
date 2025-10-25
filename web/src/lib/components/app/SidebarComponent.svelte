<script lang="ts">
    import { page } from "$app/state";

    interface sidebarProps {
        userActive?: boolean;
    }
    let { userActive = false }: sidebarProps = $props();
    let url = $derived(page.url.pathname);

    function isActiveURL(path: string): boolean {
        return url === path;
    }

    function getMenuClass(path: string, disabled: boolean = false): string {
        const baseClass =
            "px-4 py-2.5 font-bold text-sm border-3 border-stone-900 transition-all duration-200 block";

        if (disabled) {
            const disableClass =
                "text-stone-400 cursor-not-allowed pointer-events-none opacity-50";
            return `${baseClass} ${disableClass}`;
        }

        const activeClass =
            "bg-stone-900 text-white shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]";
        const inactiveClass =
            "bg-white text-stone-900 shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]";

        return `${baseClass} ${isActiveURL(path) ? activeClass : inactiveClass}`;
    }
</script>

<div class="w-full h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="px-4 pt-6 pb-4">
        <div class="relative inline-block">
            <h1 class="text-3xl font-black text-stone-900">MoneyLog</h1>
            <div
                class="absolute -bottom-1 left-0 w-full h-2 bg-amber-300 -z-10"
            ></div>
        </div>
        <div class="mt-4 h-[3px] bg-stone-900"></div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-grow flex flex-col px-4 space-y-6 overflow-y-auto" data-sveltekit-preload-data="off">
        <!-- Main Menu -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3">
                <span
                    class="text-lg font-black text-stone-900 uppercase tracking-wider"
                    >Main</span
                >
                <div class="flex-grow h-[2px] bg-stone-900"></div>
            </div>
            <div class="space-y-2">
                <a
                    href="/dashboard"
                    class={getMenuClass("/dashboard", !userActive)}
                >
                    📊 Dashboard
                </a>
                <a
                    href="/transactions"
                    class={getMenuClass("/transactions", !userActive)}
                >
                    💳 Transactions
                </a>
                <a
                    href="/categories"
                    class={getMenuClass("/categories", !userActive)}
                >
                    🏷️ Categories
                </a>
            </div>
        </div>

        <!-- Reports -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3">
                <span
                    class="text-lg font-black text-stone-900 uppercase tracking-wider"
                    >Reports</span
                >
                <div class="flex-grow h-[2px] bg-stone-900"></div>
            </div>
            <div class="space-y-2">
                <a
                    href="/summary"
                    class={getMenuClass("/summary", !userActive)}
                >
                    📈 Summary
                </a>
                <a
                    href="/statistics"
                    class={getMenuClass("/statistics", !userActive)}
                >
                    📊 Statistics
                </a>
                <a href="/budget" class={getMenuClass("/budget", !userActive)}>
                    💰 Budget
                </a>
            </div>
        </div>
    </div>

    <!-- Settings - Fixed at bottom -->
    <div class="px-4 pb-6 space-y-2">
        <div class="flex items-center gap-2 mb-3">
            <span
                class="text-lg font-black text-stone-900 uppercase tracking-wider"
                >Settings</span
            >
            <div class="flex-grow h-[2px] bg-stone-900"></div>
        </div>
        <div class="space-y-2">
            <a href="/profile" class={getMenuClass("/profile", !userActive)}>
                👤 Profile
            </a>
            <a
                href="/preferences"
                class={getMenuClass("/preferences", !userActive)}
            >
                ⚙️ Preferences
            </a>
            <form action="/?/logout" method="POST">
                <button
                    class="{getMenuClass('/logout')} w-full flex justify-start"
                    type="submit">🚪 Logout</button
                >
            </form>
        </div>
    </div>
</div>

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
