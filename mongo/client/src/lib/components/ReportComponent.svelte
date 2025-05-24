<script lang="ts">
    import { types, getReport, getCountByType, penguinStore } from '$lib/stores/PenguinStore'
	import { scale } from 'svelte/transition';
	import Draggable from '$lib/components/Draggable.svelte';
    import { onMount } from 'svelte';

    export let query;

    let loading = false

    let res: []

    async function loadReport(query: string) {
        loading = true
        res     = await getReport(query)

        console.log(res)

        loading = false
    }

    $: {
        if (query) loadReport(query)
    }

    onMount(async () => {
        if (query) loadReport(query)
    })
</script>



<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<Draggable initialX={10} initialY={400}>
<div transition:scale
	class="w-[100vw]  fixed top-[20%] md:w-[400px]  bg-[#121212] border-2 border-[#555555] rounded-xl"
    on:click|stopPropagation
>
	<div
		class="w-full h-full flex flex-col items-center justify-center p-8 space-y-4"
        on:click|stopPropagation
	>
    {#if res}
        <p class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white">Name: ({query}), found: {Object.values(res).length} {Object.keys(res)}</p>
        {#if loading}
            <p class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-green-400">Loading... </p>
        {:else if res}
            {#each Object.keys(res) as k}
                <p class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white">{k}: {res[k].length}</p>
            {/each}
        {:else}
            <p class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-red-400">Nothing. </p>
        {/if}
    {/if}
    </div>
</div>
</Draggable>

<svelte:window on:click={penguinStore.closeMenu} />
