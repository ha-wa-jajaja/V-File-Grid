<script setup lang="ts">
import type {
  VFgContainerProvides,
  VFgFileUploaderProvides,
} from '@/types/types'
import { useVFgItemClickChain } from '@/composables/useVFgItemClickChain'
import { useVFgItemDragChain } from '@/composables/useVFgItemDragChain'
import { defineProps, inject, computed, watch } from 'vue'

const props = defineProps<{
  id: string
  scrollerY: number
}>()

const emits = defineEmits(['onItemDragStateChange'])

const selectionInjection = inject<VFgContainerProvides>('selection')
if (!selectionInjection) {
  console.error('Injection for "selection" not found')
  throw new Error('Injection not found')
}
const { selectedIds, multiItemsBoard, updateSelectedIds, updateScrollerY } =
  selectionInjection

const fileUploaderInjection = inject<VFgFileUploaderProvides>('uploader')
if (!fileUploaderInjection) {
  console.error('Injection for "uploader" not found')
  throw new Error('Injection not found')
}
const { setInternalDragStatus } = fileUploaderInjection

const isSelected = computed(() => !!selectedIds.value?.has(props.id))
const selectedItemsCount = computed(() => selectedIds.value?.size ?? 0)

const { onVFgItemMouseDown, onVFgItemClick } = useVFgItemClickChain({
  vFsItemId: props.id,
  isSelected,
  updateSelectedIds,
})

const { isDragging, onDragStart, onDragMove, onDragEnd } = useVFgItemDragChain({
  itemId: props.id,
  selectedItemsCount,
  scrollerY: props.scrollerY,
  scrollerYSetter: updateScrollerY,
  multiSelectionBackboard: multiItemsBoard,
  setInternalDragStatus,
})

watch(isDragging, v => {
  emits('onItemDragStateChange', v)
})

// TODO: Should add a drop action here? Or another component?
</script>

<template>
  <div
    draggable="true"
    @mousedown="onVFgItemMouseDown"
    @click="onVFgItemClick"
    @dragstart="onDragStart"
    @drag="onDragMove"
    @dragend="onDragEnd"
  >
    <slot :isSelected="isSelected" :id="props.id" />
  </div>
</template>
