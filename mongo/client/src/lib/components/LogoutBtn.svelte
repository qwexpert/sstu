<script lang="ts">
    import { authStore } from '$lib/stores/Auth'
    
    $: authenticated = $authStore.authenticated
</script>

{#if authenticated}
<div class="fixed top-0 right-0 flex p-6">
    <button
        on:click={authStore.logout}
        class="px-6 py-2 bg-red-600/20 text-red-600 rounded-xl hover:rounded-sm hover:cursor-pointer"
    >
        Logout
    </button>
</div>
{/if}

<style>
    
</style>