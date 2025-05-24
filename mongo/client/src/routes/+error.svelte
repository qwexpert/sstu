
<script lang="ts">
    import Draggable from '$lib/components/Draggable.svelte'
</script>


<Draggable initialX={400} initialY={150}>
     <div class="w-[600px] h-[300px] flex justify-center items-center bg-[#121212] border-2 border-[#555555] rounded-xl">
        <a href="/" class="text-green-400 text-5xl animate-pulse">404 NOT FOUND</a>
     </div>   
</Draggable>

