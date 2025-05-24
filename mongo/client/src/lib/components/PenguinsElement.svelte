<script>
    import { raritys, penguinStore } from '$lib/stores/PenguinStore'
    import Draggable from './Draggable.svelte'

    $: ({ penguins, loading, error } = $penguinStore)
</script>


{#if loading}
    <div class="w-full p-6 text-center text-green-500">Loading penguins...</div>
{:else if error}
    <div class="w-full p-6 text-center text-[#e74c3c]">Error: {error}</div>
{:else}
    <div>
    {#each penguins as penguin}
    <Draggable initialX={Math.floor(Math.random() * window.innerWidth)} initialY={Math.floor(Math.random() * window.innerHeight)}>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div on:contextmenu={(e) => penguinStore.showContextMenu(e, penguin)}  
            class="flex flex-col align-center justify-center { penguin.rarity === 'Epic' ? 'text-[#F02070]' : penguin.rarity === 'Rare' ? 'text-[#F0A020]' : 'text-[#3498db]' }"
        >
            <h2>{penguin.name}</h2>
            <img src={penguin.type === "Kitty" ? "kitty.png" : penguin.type === "Penguin" ? "peng.png" : "capy.png"} alt="Penguin" width="48" draggable="false" />
        </div>
    </Draggable>
        
    {/each}
    </div>
{/if}

<svelte:window on:click={penguinStore.closeMenu} />


