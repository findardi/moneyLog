<script lang="ts">
    import { page } from "$app/state";
    import type { SuperValidated } from "sveltekit-superforms";
    import ActivatedComponent from "./ActivatedComponent.svelte";
    import QuickActionComponent from "./QuickActionComponent.svelte";
    import type { activationDTO } from "$lib/schema/user.schema";

    interface homeProps {
        form: SuperValidated<activationDTO>;
    }

    let { form }: homeProps = $props();

    const username = $derived(page.data.username || "Friends");
    const isActive = $derived(page.data.isActive || false);
</script>

<div class="w-full h-full flex items-center justify-center">
    <div class="w-full max-w-6xl">
        <div class="grid lg:grid-cols-2 gap-6 p-2">
            <div class="order-1 flex items-center">
                <div class="w-full space-y-4">
                    <div
                        class="relative bg-amber-100 border-3 border-stone-900 p-6 md:p-8
                               shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200"
                    >
                        <div
                            class="absolute -top-3 -left-3 bg-stone-900 text-amber-100
                                   px-3 py-1 text-xs md:text-sm font-bold border-3 border-stone-900
                                   rotate-[-2deg]"
                        >
                            ✨ WELCOME
                        </div>

                        <div class="flex flex-col space-y-3 md:space-y-4 mt-2">
                            <h1
                                class="text-3xl md:text-4xl font-black text-stone-900 leading-tight"
                            >
                                Hey, <span
                                    class="inline-block bg-stone-900 text-amber-100 px-2 md:px-3 py-1 rotate-[-1deg]"
                                    >{username}!</span
                                >
                            </h1>

                            <p
                                class="text-base md:text-lg text-stone-700 font-semibold leading-relaxed"
                            >
                                Stop wondering<br />
                                <span
                                    class="inline-block bg-stone-900 text-white px-2 py-1 rotate-[1deg] mt-1 text-sm md:text-base"
                                >
                                    "Where did my money go?"
                                </span>
                            </p>

                            <p
                                class="text-sm md:text-base text-stone-600 leading-relaxed"
                            >
                                Track every expense, visualize your spending,
                                and take control of your finances—all in one
                                place.
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 md:gap-4">
                        <div
                            class="bg-blue-100 border-3 border-stone-900 p-3 md:p-4
                                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-2xl md:text-3xl font-black text-stone-900"
                                    >📊</span
                                >
                                <span
                                    class="text-xs md:text-sm font-bold text-stone-700 mt-2"
                                    >Track & Analyze</span
                                >
                            </div>
                        </div>
                        <div
                            class="bg-green-100 border-3 border-stone-900 p-3 md:p-4
                                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-2xl md:text-3xl font-black text-stone-900"
                                    >💰</span
                                >
                                <span
                                    class="text-xs md:text-sm font-bold text-stone-700 mt-2"
                                    >Save Money</span
                                >
                            </div>
                        </div>
                        <div
                            class="bg-purple-100 border-3 border-stone-900 p-3 md:p-4
                                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-2xl md:text-3xl font-black text-stone-900"
                                    >🤖</span
                                >
                                <span
                                    class="text-xs md:text-sm font-bold text-stone-700 mt-2"
                                    >Powered By AI</span
                                >
                            </div>
                        </div>
                        <div
                            class="bg-pink-100 border-3 border-stone-900 p-3 md:p-4
                                   shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                                   hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                                   hover:translate-x-[-2px] hover:translate-y-[-2px]
                                   transition-all duration-200"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-2xl md:text-3xl font-black text-stone-900"
                                    >✨</span
                                >
                                <span
                                    class="text-xs md:text-sm font-bold text-stone-700 mt-2"
                                    >Easy To Use</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Section: Quick Actions or Activation -->
            <div class="order-2 flex items-center">
                <div class="w-full space-y-4">
                    {#if isActive}
                        <QuickActionComponent />
                    {:else}
                        <ActivatedComponent {form} />
                    {/if}
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
