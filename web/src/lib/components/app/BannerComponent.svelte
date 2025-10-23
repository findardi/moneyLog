<script lang="ts">
    import { goto } from "$app/navigation";

    function handleLogin() {
        goto("/auth?tab=login");
    }
</script>

<div
    class="w-full min-h-screen flex items-center justify-center bg-amber-50 p-4"
>
    <div class="w-full max-w-4xl">
        <div
            class="relative bg-white border-3 border-stone-900 p-8 md:p-12
                   shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]
                   transition-all duration-200"
        >
            <div
                class="absolute -top-4 -left-4 bg-amber-300 text-stone-900
                       px-4 py-2 text-sm font-black border-3 border-stone-900
                       rotate-[-3deg] shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]"
            >
                ✨ NEW & FREE
            </div>

            <div class="space-y-8 mt-4">
                <div class="text-center space-y-2">
                    <div class="inline-block relative">
                        <h1
                            class="text-5xl md:text-7xl font-black text-stone-900"
                        >
                            MoneyLog
                        </h1>
                        <div
                            class="absolute -bottom-2 left-0 w-full h-4 bg-amber-300 -z-10"
                        ></div>
                    </div>
                </div>

                <div class="text-center space-y-4">
                    <h2 class="text-2xl md:text-3xl font-black text-stone-900">
                        Stop Wondering
                        <span
                            class="inline-block bg-stone-900 text-amber-100 px-3 py-1 rotate-[-1deg] mx-1"
                        >
                            "Where Did My Money Go?"
                        </span>
                    </h2>
                    <p
                        class="text-lg md:text-xl text-stone-700 font-semibold max-w-2xl mx-auto"
                    >
                        Track every expense, visualize your spending, and take
                        control of your finances—all in one place.
                    </p>
                </div>

                <div
                    class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto"
                >
                    <div
                        class="bg-blue-100 border-3 border-stone-900 p-4
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[5px_5px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200"
                    >
                        <div
                            class="flex flex-col items-center text-center space-y-2"
                        >
                            <span class="text-3xl">📊</span>
                            <span class="text-xs font-bold text-stone-900"
                                >Track & Analyze</span
                            >
                        </div>
                    </div>
                    <div
                        class="bg-green-100 border-3 border-stone-900 p-4
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[5px_5px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200"
                    >
                        <div
                            class="flex flex-col items-center text-center space-y-2"
                        >
                            <span class="text-3xl">💰</span>
                            <span class="text-xs font-bold text-stone-900"
                                >Save Money</span
                            >
                        </div>
                    </div>
                    <div
                        class="bg-purple-100 border-3 border-stone-900 p-4
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[5px_5px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200"
                    >
                        <div
                            class="flex flex-col items-center text-center space-y-2"
                        >
                            <span class="text-3xl">🤖</span>
                            <span class="text-xs font-bold text-stone-900"
                                >AI Powered</span
                            >
                        </div>
                    </div>
                    <div
                        class="bg-pink-100 border-3 border-stone-900 p-4
                               shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[5px_5px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200"
                    >
                        <div
                            class="flex flex-col items-center text-center space-y-2"
                        >
                            <span class="text-3xl">✨</span>
                            <span class="text-xs font-bold text-stone-900"
                                >Easy to Use</span
                            >
                        </div>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div
                    class="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto"
                >
                    <button
                        onclick={handleLogin}
                        class="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white font-black text-lg
                               border-3 border-stone-900
                               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
                               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
                               hover:translate-x-[-2px] hover:translate-y-[-2px]
                               transition-all duration-200
                               uppercase tracking-wide"
                    >
                        🚀 Get Started Free
                    </button>
                </div>

                <div class="text-center">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border-3 border-stone-900"
                    >
                        <span class="text-sm font-bold text-stone-900">
                            ✓ 100% Free Forever • ✓ No Credit Card Required
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-4 justify-center mt-6">
            <div
                class="bg-amber-300 border-3 border-stone-900 px-6 py-2 rotate-[-2deg] shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]"
            >
                <span class="text-sm font-black text-stone-900"
                    >📱 Mobile Friendly -> UPCOMING FEATURE</span
                >
            </div>
            <div
                class="bg-blue-200 border-3 border-stone-900 px-6 py-2 rotate-[2deg] shadow-[3px_3px_0px_0px_rgba(41,37,36,1)]"
            >
                <span class="text-sm font-black text-stone-900"
                    >🔒 Secure & Private</span
                >
            </div>
        </div>
    </div>
</div>

<style>
    .border-3 {
        border-width: 3px;
    }
</style>
