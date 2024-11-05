<script setup lang="ts">
import type { VFsContainerProvides } from '@/types/types'
import { defineProps, inject, computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  id: string
  scrollerY: number
}>()

const selectionInjection = inject<VFsContainerProvides>('selection')
if (!selectionInjection) {
  console.error('Injection for "selection" not found')
  throw new Error('Injection not found')
}
const { selectedIds, updateSelectedIds } = selectionInjection

const isSelected = computed(() => selectedIds.value.has(props.id))

const { onVFsItemMouseDown, onVFsItemClick } = useVFsItemClickChain()

function useVFsItemClickChain() {
  let isMouseDownAction = false

  function onVFsItemMouseDown(e: MouseEvent) {
    e.stopPropagation()
    if (isSelected.value) return

    isMouseDownAction = true

    if (e.ctrlKey || e.metaKey) {
      updateSelectedIds('append', props.id)
      return
    }

    if (e.shiftKey) {
      updateSelectedIds('add-multi', props.id)
      return
    }

    updateSelectedIds('select', props.id)
  }

  function onVFsItemClick() {
    if (isMouseDownAction) {
      isMouseDownAction = false
      return
    }
    if (isSelected.value) updateSelectedIds('select', props.id)
  }

  return { onVFsItemMouseDown, onVFsItemClick }
}

function useVFsItemDragChain() {
  let moveDragInterval: number | null = null
  const { height: windowH } = useWindowSize()
  const isDragging = ref(false)

  // TODO: Send the isDragging value outside: => emits('onDragStateChange') ?
  // TODO: Go through the scroller function: how to make more sense?
  // TODO: Work on the multi selection backboard: where to place & how to access?

  function onDragStart(event: DragEvent) {
    event.stopPropagation()
    event.stopImmediatePropagation()

    isDragging.value = true

    if (dragItemsCount.value && props.selectedMaterials.size > 1) {
      event.dataTransfer?.setDragImage(dragItemsCount.value, 50, 50)
    }

    event?.dataTransfer?.setData('itemId', props.id)
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging.value) return

    if (e.clientY < windowH.value * 0.2) {
      if (moveDragInterval) return
      moveDragInterval = setInterval(() => {
        if (props.scrollerY > 20)
          globalStore.defaultLayoutScroll.toSet =
            defaultLayoutContentY.value - 80
      }, 80) as unknown as number
    } else {
      if (!moveDragInterval) return
      clearInterval(moveDragInterval)
      moveDragInterval = null
    }
  }

  function onDragEnd() {
    isDragging.value = false
    if (moveDragInterval) {
      clearInterval(moveDragInterval)
      moveDragInterval = null
    }
  }

  return { isDragging, onDragStart, onDragMove, onDragEnd }
}
// TODO: Should add a drop action here? Or another component?
</script>

<template>
  <div @mousedown="onVFsItemMouseDown" @click="onVFsItemClick">
    <slot :isSelected="isSelected" :id="props.id" />
  </div>
</template>
