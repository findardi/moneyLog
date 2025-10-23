<script lang="ts">
    import { goto } from "$app/navigation";
    import LoginComponent from "$lib/components/auth/LoginComponent.svelte";
    import RegisterComponent from "$lib/components/auth/RegisterComponent.svelte";
    import type { PageProps } from "./$types";
    import { browser } from "$app/environment";
    import { DotLottieSvelte } from "@lottiefiles/dotlottie-svelte";

    let { data }: PageProps = $props();
    let selectTab = $state("login");
    let isDesktop = $state(false);

    $effect(() => {
        if (selectTab) {
            goto(`/auth?tab=${selectTab}`, { replaceState: true });
        }
    });

    $effect(() => {
        if (browser) {
            const mediaQuery = window.matchMedia("(min-width: 768px)");
            isDesktop = mediaQuery.matches;
            const handler = (e: MediaQueryListEvent) => {
                isDesktop = e.matches;
            };
            mediaQuery.addEventListener("change", handler);
            return () => {
                mediaQuery.removeEventListener("change", handler);
            };
        }
    });

    function switchToLogin() {
        selectTab = "login";
    }
</script>

<div
    class="min-h-screen w-full flex items-center justify-center bg-amber-50 p-4 md:p-6 lg:p-8"
>
    <div class="w-full max-w-7xl mx-auto">
        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
            <!-- Animation Section -->
            <div
                class="hidden lg:flex items-center justify-center order-2 lg:order-2"
            >
                {#if isDesktop}
                    <div
                        class="w-full max-w-[600px] aspect-square bg-blue-100 border-3 border-stone-900
                               shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] p-8"
                    >
                        <DotLottieSvelte
                            src="src/lib/assets/lottie/authAnimation.lottie"
                            loop
                            autoplay
                        />
                    </div>
                {/if}
            </div>

            <!-- Auth Form Section -->
            <div class="flex items-center justify-center order-1 lg:order-1">
                <div class="w-full max-w-md">
                    <!-- Tabs -->
                    <div class="flex gap-2 mb-4">
                        <button
                            onclick={() => (selectTab = "login")}
                            class="px-6 py-3 font-bold text-base border-3 border-stone-900
                                   transition-all duration-200 {selectTab ===
                            'login'
                                ? 'bg-stone-900 text-amber-50 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]'
                                : 'bg-white text-stone-900 shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}"
                        >
                            Login
                        </button>

                        <button
                            onclick={() => (selectTab = "register")}
                            class="px-6 py-3 font-bold text-base border-3 border-stone-900
                                   transition-all duration-200 {selectTab ===
                            'register'
                                ? 'bg-stone-900 text-amber-50 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]'
                                : 'bg-white text-stone-900 shadow-[2px_2px_0px_0px_rgba(41,37,36,1)] hover:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}"
                        >
                            Register
                        </button>
                    </div>

                    <!-- Content Card -->
                    <div
                        class="bg-white border-3 border-stone-900
                               shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
                               transition-all duration-200
                               hover:shadow-[10px_10px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                        <div class="p-6 md:p-8">
                            {#if selectTab === "login"}
                                <LoginComponent
                                    form={data.loginForm}
                                    actions="?/login"
                                />
                            {:else}
                                <RegisterComponent
                                    form={data.registerForm}
                                    actions="?/register"
                                    onSuccess={switchToLogin}
                                />
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
