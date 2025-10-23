<script lang="ts"></script>

<div class="flex items-center gap-2">
    <h2 class="text-xl md:text-2xl font-black text-stone-900 uppercase">
        Quick Actions
    </h2>
    <div class="flex-grow h-[3px] bg-stone-900"></div>
</div>

<div class="space-y-3">
    <a
        href="/transactions?action=new"
        class="block w-full bg-green-200 border-3 border-stone-900 p-4 md:p-5
               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
               hover:translate-x-[-2px] hover:translate-y-[-2px]
               transition-all duration-200 group"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl md:text-3xl">➕</span>
                <div>
                    <h3 class="text-base md:text-lg font-black text-stone-900">
                        Add Transaction
                    </h3>
                    <p class="text-xs md:text-sm text-stone-600 font-medium">
                        Record income or expense
                    </p>
                </div>
            </div>
            <span
                class="text-stone-900 group-hover:translate-x-1 transition-transform"
                >→</span
            >
        </div>
    </a>

    <a
        href="/dashboard"
        class="block w-full bg-blue-200 border-3 border-stone-900 p-4 md:p-5
               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
               hover:translate-x-[-2px] hover:translate-y-[-2px]
               transition-all duration-200 group"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl md:text-3xl">📊</span>
                <div>
                    <h3 class="text-base md:text-lg font-black text-stone-900">
                        View Dashboard
                    </h3>
                    <p class="text-xs md:text-sm text-stone-600 font-medium">
                        See your financial overview
                    </p>
                </div>
            </div>
            <span
                class="text-stone-900 group-hover:translate-x-1 transition-transform"
                >→</span
            >
        </div>
    </a>

    <a
        href="/categories"
        class="block w-full bg-purple-200 border-3 border-stone-900 p-4 md:p-5
               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
               hover:translate-x-[-2px] hover:translate-y-[-2px]
               transition-all duration-200 group"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl md:text-3xl">🏷️</span>
                <div>
                    <h3 class="text-base md:text-lg font-black text-stone-900">
                        Manage Categories
                    </h3>
                    <p class="text-xs md:text-sm text-stone-600 font-medium">
                        Organize your expenses
                    </p>
                </div>
            </div>
            <span
                class="text-stone-900 group-hover:translate-x-1 transition-transform"
                >→</span
            >
        </div>
    </a>

    <a
        href="/budget"
        class="block w-full bg-yellow-200 border-3 border-stone-900 p-4 md:p-5
               shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
               hover:shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]
               hover:translate-x-[-2px] hover:translate-y-[-2px]
               transition-all duration-200 group"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl md:text-3xl">💰</span>
                <div>
                    <h3 class="text-base md:text-lg font-black text-stone-900">
                        Set Budget
                    </h3>
                    <p class="text-xs md:text-sm text-stone-600 font-medium">
                        Plan your spending limits
                    </p>
                </div>
            </div>
            <span
                class="text-stone-900 group-hover:translate-x-1 transition-transform"
                >→</span
            >
        </div>
    </a>
</div>
