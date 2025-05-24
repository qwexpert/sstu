<script lang="ts">
    import { raritys, types, penguinStore } from '$lib/stores/PenguinStore'

    let nameInput = ''
    let descInput = ''
    let selectedType = types[0].value
    let selectedRarity = raritys[0].value

    
    async function handleSubmit() {
        const success = await penguinStore.createPenguin(nameInput, descInput, selectedType, selectedRarity)
        if (success) {
            nameInput = ''
            selectedType = types[0].value
            selectedRarity = raritys[0].value
            descInput = ''
        }
    }
</script>



<div
	class="w-[100vw] h-[40vh] fixed top-[20%] md:w-[400px] md:h-[400px] bg-[#121212] border-2 border-[#555555] rounded-xl"
>
	<div
		class="w-full h-full flex flex-col items-center justify-center p-8 space-y-4"
	>
        <input bind:value={nameInput} type="text" placeholder="Name" class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400">
        <!-- <div class="flex">
            <input bind:value={type} type="radio" placeholder="Penguin" class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400" />
            <input bind:value={type} type="radio" placeholder="Kitty" class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400" />
            <input bind:value={type} type="radio" placeholder="Nothing" class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400" />
        </div> -->
        <select
                bind:value={selectedType}
                class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400 appearance-none"
                aria-required="true"
            >
                {#each types as type}
                    <option value={type.value}>{type.label}</option>
                {/each}
        </select>
        <select
                bind:value={selectedRarity}
                class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400 appearance-none"
                aria-required="true"
            >
                {#each raritys as rarity}
                    <option value={rarity.value}>{rarity.label}</option>
                {/each}
        </select>
        <textarea bind:value={descInput} class="w-full px-4 py-2 bg-[#222222] border border-[#555555] rounded text-white focus:outline-none focus:border-green-400">Description</textarea>
        <button
			on:click={handleSubmit}
			class="px-6 py-2 bg-blue-600/20 text-blue-600 rounded-lg hover:rounded-sm hover:cursor-pointer"
		>
            Create
		</button>
    </div>
</div>