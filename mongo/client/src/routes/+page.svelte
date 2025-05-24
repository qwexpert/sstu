<script lang="ts">
	import { onMount } from "svelte";
	import { scale } from "svelte/transition";
	import AuthForm from "$lib/components/AuthForm.svelte";
	import Draggable from "$lib/components/Draggable.svelte";
	import { authStore } from "$lib/stores/Auth";
	import PenguinsElement from "$lib/components/PenguinsElement.svelte";
    import PenguinInfo from "$lib/components/PenguinInfo.svelte";
	import PenguinsControllerElement from "$lib/components/PenguinsControllerElement.svelte";
	import { penguinStore } from "$lib/stores/PenguinStore";
	import CatalogElement from "$lib/components/CatalogElement.svelte";

    let isPortrait = false

    function checkScreenRatio() {
        isPortrait = window.innerHeight > window.innerWidth
    }

    $: authenticated = $authStore.authenticated
    $: selectedPenguin = $penguinStore.selectedPenguin


	onMount(() => {
        authStore.checkAuth()
        checkScreenRatio()

        window.addEventListener('resize', checkScreenRatio);
		
		return () => window.removeEventListener('resize', checkScreenRatio)
    })

</script>

{#if !isPortrait}
    {#if !authenticated}
        <Draggable initialX={400} initialY={150}>
            <div transition:scale>
                <AuthForm />
            </div>
        </Draggable>  
    {:else}
        <CatalogElement />
        <Draggable initialX={900} initialY={250}>
            <PenguinsControllerElement />
        </Draggable>
        <PenguinsElement />
        {#if selectedPenguin}
            <PenguinInfo />
        {/if}
    {/if}
{:else}
    {#if !authenticated}
        <div transition:scale>
            <AuthForm />
        </div>
            
    {/if}
{/if}

