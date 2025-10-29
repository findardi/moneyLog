<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface InputProps {
        value?: any;
        nameField?: string;
        type?: string;
        step?: string;
        placeholder?: string;
        class?: string;
    }

    let {
        type = "text",
        step,
        placeholder,
        value = $bindable(),
        nameField,
        class: className = "",
        ...restProps
    }: InputProps & HTMLInputAttributes = $props();
</script>

<div class="relative">
    <input
        {type}
        {step}
        class="w-full p-3 border-3 border-stone-900
           focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)]
           transition-all duration-200 font-medium text-sm
           placeholder:text-stone-400 {className}"
        {placeholder}
        bind:value
        {...restProps}
    />
    {#if nameField}
        <span
            class="absolute -top-2 left-3 bg-white px-1 text-[10px]
               font-bold text-stone-500 uppercase tracking-wide"
        >
            {nameField}
        </span>
    {/if}
</div>
