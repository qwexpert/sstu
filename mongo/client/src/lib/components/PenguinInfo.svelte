<script lang="ts">
    import { penguinStore } from '$lib/stores/PenguinStore'
	import { scale } from 'svelte/transition';

    let newName: HTMLInputElement
    let newDesc: HTMLTextAreaElement

    $: selectedPenguin = $penguinStore.selectedPenguin

    $: if (selectedPenguin) {
        if (newName) newName.value = selectedPenguin.name
        if (newDesc) newDesc.value = selectedPenguin.description || ''
    }
</script>



<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div transition:scale
	class="w-[100vw] fixed right-0 bottom-0 md:w-[400px]"
    on:click|stopPropagation
>
	<div
		class="w-full h-full flex flex-col items-center justify-center p-8 space-y-4"
	>
        <input bind:this={newName} type="text" placeholder={selectedPenguin.name} class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400" />
        <textarea bind:this={newDesc} class="w-full min-h-[50vh] px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400">{selectedPenguin.description || '...'}</textarea>
        <div class="flex">
            <button
                on:click={penguinStore.deletePenguin}
                class="mr-2 px-6 py-2 bg-red-600/20 text-red-600 rounded-lg hover:rounded-sm hover:cursor-pointer"
            >
                Remove
            </button>
            <button
                on:click={() => penguinStore.updatePenguin(newName.value, newDesc.value)}
                class="px-6 py-2 bg-blue-600/20 text-blue-600 rounded-lg hover:rounded-sm hover:cursor-pointer"
            >
                Update info
            </button>
        </div>
        
    </div>
</div>

<svelte:window on:click={penguinStore.closeMenu} />
