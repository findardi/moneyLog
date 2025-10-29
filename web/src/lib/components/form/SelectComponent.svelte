<script lang="ts">
    import Select from 'svelte-select';
    import type { HTMLAttributes } from 'svelte/elements';

    interface SelectOption {
        value: any;
        label: string;
    }

    interface SelectProps {
        placeholder?: string;
        value?: any;
        items?: SelectOption[];
        data?: any[];
        nameField?: string;
        name?: string;
        id?: string;
        searchable?: boolean;
        clearable?: boolean;
        disabled?: boolean;
    }

    let { 
        placeholder = "Select", 
        value = $bindable(), 
        items = [],
        data = [], 
        nameField,
        name,
        id,
        searchable = false,
        clearable = false,
        disabled = false,
        ...restProps 
    }: SelectProps & HTMLAttributes<HTMLDivElement> = $props();

    let selectItems = $derived(
        items.length > 0 
            ? items 
            : data.map(item => 
                typeof item === 'string' || typeof item === 'number'
                    ? { value: item, label: String(item) }
                    : item
            )
    );
    
    let selectedItem = $derived(
        value !== undefined && value !== null && value !== ''
            ? selectItems.find(item => item.value === value) || null
            : null
    );
    
    function handleSelect(event: CustomEvent) {
        const detail = event.detail;
        if (detail) {
            value = detail.value;
        } else {
            value = undefined;
        }
    }

    function handleClear() {
        value = undefined;
    }
</script>

<div class="relative select-wrapper" {...restProps}>
    <Select
        {placeholder}
        value={selectedItem}
        on:change={handleSelect}
        on:clear={handleClear}
        items={selectItems}
        {name}
        {id}
        {searchable}
        {clearable}
        {disabled}
        class="w-full p-3 border-3 border-stone-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] transition-all duration-200 font-medium text-sm placeholder:text-stone-400"
    />
    {#if nameField}
        <span
            class="absolute -top-2 left-3 bg-white px-1 text-[10px] z-10
               font-bold text-stone-500 uppercase tracking-wide pointer-events-none"
        >
            {nameField}
        </span>
    {/if}
</div>

<style>
    .select-wrapper {
        width: 100%;
    }

    :global(.select-wrapper .svelte-select) {
        border: 3px solid rgb(41, 37, 36) !important;
        border-radius: 0 !important;
        box-shadow: none;
        transition: all 0.2s;
    }
    
    :global(.select-wrapper .svelte-select:focus-within) {
        box-shadow: 4px 4px 0px 0px rgba(41,37,36,1) !important;
        outline: none !important;
    }
    
    :global(.select-wrapper .svelte-select input) {
        font-weight: 500 !important;
        color: rgb(41, 37, 36);
    }

    :global(.select-wrapper .value-container) {
        padding: 12px;
    }

    :global(.select-wrapper .svelte-select-list) {
        border: 3px solid rgb(41, 37, 36) !important;
        border-radius: 0 !important;
        box-shadow: 4px 4px 0px 0px rgba(41,37,36,1);
        margin-top: 4px;
    }

    :global(.select-wrapper .list-item) {
        padding: 12px;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.15s;
        color: rgb(41, 37, 36);
    }

    :global(.select-wrapper .list-item:hover) {
        background-color: rgb(245, 245, 244);
    }

    :global(.select-wrapper .list-item.active),
    :global(.select-wrapper .list-item.selected) {
        background-color: rgb(41, 37, 36) !important;
        color: white !important;
        font-weight: 700;
    }

    :global(.select-wrapper .indicators) {
        padding-right: 8px;
    }

    :global(.select-wrapper .indicator) {
        color: rgb(120, 113, 108);
    }

    /* Styling untuk disabled state */
    :global(.select-wrapper .svelte-select.disabled) {
        background-color: rgb(250, 250, 249);
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>