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
</script>

<div
    class="min-h-screen w-full flex items-center justify-center bg-base-200 p-4 md:p-6 lg:p-8"
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
                    <div class="w-full max-w-[600px] aspect-square">
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
                    <div class="tabs tabs-lift justify-center mb-8">
                        <label class="tab">
                            <input
                                type="radio"
                                name="auth_tabs"
                                value="login"
                                bind:group={selectTab}
                            />
                            <div
                                class="font-semibold text-base md:text-lg transition-all duration-300 {selectTab ===
                                'login'
                                    ? 'scale-110 text-base-content'
                                    : 'scale-100 text-base-content/60'}"
                            >
                                Login
                            </div>
                        </label>

                        <label class="tab">
                            <input
                                type="radio"
                                name="auth_tabs"
                                value="register"
                                bind:group={selectTab}
                            />
                            <div
                                class="font-semibold text-base md:text-lg transition-all duration-300 {selectTab ===
                                'register'
                                    ? 'scale-110 text-base-content'
                                    : 'scale-100 text-base-content/60'}"
                            >
                                Register
                            </div>
                        </label>
                    </div>

                    <!-- Content Card -->
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body p-6 md:p-8">
                            {#if selectTab === "login"}
                                <LoginComponent form={data.loginForm} />
                            {:else}
                                <RegisterComponent form={data.registerForm} />
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
