<script lang="ts">
    import { onMount } from "svelte"
	import { scale } from "svelte/transition";

    export let initialX = 400
    export let initialY = 150

    let posX = 0
    let posY = 0
    let isDragging = false
    let currentTranslate = { x: initialX, y: initialY }
    let parentRect = { width: 0, height: 0, left: 0, top: 0 }
    let draggableRect = { width: 0, height: 0 }
    let draggableElement: HTMLDivElement

    function handleMouseDown(e: MouseEvent) {
        isDragging = true
        posX = e.clientX
        posY = e.clientY
        
        draggableRect = draggableElement.getBoundingClientRect()
        const transform = window.getComputedStyle(draggableElement).transform

        if (transform !== 'none') {
            const matrix = transform.match(/^matrix\((.+)\)$/)
            if (matrix) {
                const values = matrix[1].split(', ')
                currentTranslate.x = parseFloat(values[4])
                currentTranslate.y = parseFloat(values[5])
            }
        }
        
        draggableElement.classList.remove('transition-transform')
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    function handleMouseMove(e: MouseEvent) {
        if (isDragging) {
            const dx = e.clientX - posX
            const dy = e.clientY - posY

            let newX = currentTranslate.x + dx
            let newY = currentTranslate.y + dy

            const maxX = parentRect.width - draggableRect.width
            const maxY = parentRect.height - draggableRect.height

            newX = Math.max(0, Math.min(newX, maxX))
            newY = Math.max(0, Math.min(newY, maxY))

            draggableElement.style.transform = `translate(${newX}px, ${newY}px)`
        }
    }

    function handleMouseUp() {
        if (!isDragging) return

        isDragging = false;
        draggableElement.classList.add('transition-transform')
        
        const transform = draggableElement.style.transform;
        if (transform) {
            const matches = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/)
            if (matches) {
                currentTranslate.x = parseFloat(matches[1])
                currentTranslate.y = parseFloat(matches[2])
            }
        }
        
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }

    onMount(() => {
        const parent = document.querySelector('.dotted-bg') as HTMLElement

        function updateRects() {
            parentRect = parent.getBoundingClientRect()
            draggableRect = draggableElement.getBoundingClientRect()
        }

        updateRects()

        const observer = new ResizeObserver(updateRects)
        observer.observe(parent)
        
        return () => observer.disconnect()
    })
</script>

<div
    transition:scale
    bind:this={draggableElement}
    class="fixed transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing"
    style="transform: translate({currentTranslate.x}px, {currentTranslate.y}px)"
    onmousedown={handleMouseDown}
    role="button"
    tabindex="0"
    aria-grabbed={isDragging}
>
    <slot></slot>
</div>

<style>
    [aria-grabbed="true"] {
        user-select: none;
    }
</style>