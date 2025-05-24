<script lang="ts">
    import { getCountByType, raritys, types, penguinStore } from '$lib/stores/PenguinStore'
	import { onMount } from 'svelte';
	import ReportComponent from '$lib/components/ReportComponent.svelte';

    let reportState: boolean = false

    let nameInput: string
    let typeInput: string | undefined
    let rarityInput: string | undefined

    let counts = {}

    async function handleSelect() {
        penguinStore.loadPenguins({ type: typeInput, startsWith: nameInput, rarity: rarityInput })
        reportState = true
    }


    onMount(async () => {
        const res = await getCountByType()

        window.addEventListener('click', () => reportState = false)



        counts = {
            'Penguin': res['Penguin']?.length || 0,
            'Kitty': res['Kitty']?.length || 0,
            'Other': res['Other']?.length || 0,
        }
    })

</script>


<div class="fixed top-6 left-6 flex rounded-xl z-[2]">
    <select
        bind:value={typeInput}
        class="w-full mr-2 px-2 py-2 bg-[#222222] border border-[#555555] rounded text-center text-gray-400  appearance-none"
        aria-required="true"
    >   
            <option on:click={handleSelect}>All</option>
        {#each types as type}
            <option on:click={handleSelect} value={type.value}>{type.label} ({counts[type.value]})</option>
        {/each}
    </select>
    <select
        bind:value={rarityInput}
        class="w-full mr-2 px-2 py-2 bg-[#222222] border border-[#555555] rounded text-center text-gray-400  appearance-none"
        aria-required="true"
    >       
            <option on:click={handleSelect}>Any</option>
        {#each raritys as rarity}
            <option on:click={handleSelect} value={rarity.value}>{rarity.label}</option>
        {/each}
    </select>
    <input bind:value={nameInput} on:keydown={(e) => e.key === "Enter" && handleSelect()} type="text" placeholder="Name" class="px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400">
</div>

{#if reportState}
    <ReportComponent query={nameInput} />
{/if}

