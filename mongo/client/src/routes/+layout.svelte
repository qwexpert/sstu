<script lang="ts">
	import '../app.css'
    import LogoutBtn from "$lib/components/LogoutBtn.svelte"
	
	let { children } = $props();
</script>

<div class="w-screen h-screen dotted-bg relative overflow-hidden">
    <LogoutBtn />   
    {@render children()}
</div>


<style>
	* {
		margin: 0;
		padding: 0;
	}
	
	.dotted-bg {
        background-color: #121212; 
        background-image: radial-gradient(circle, #555555 2px, transparent 2px);
        background-size: 40px 40px; 
    }
</style>
