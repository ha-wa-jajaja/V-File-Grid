<script setup lang="ts">
import type {
  VFsContainerProvides,
  VFsFileUploaderProvides,
} from '@/types/types'
import { useVFsItemClickChain } from '@/composables/useVFsItemClickChain'
import { useVFsItemDragChain } from '@/composables/useVFsItemDragChain'
import { defineProps, inject, computed, watch } from 'vue'

const props = defineProps<{
  id: string
  scrollerY: number
}>()

const emits = defineEmits(['onItemDragStateChange'])

const selectionInjection = inject<VFsContainerProvides>('selection')
if (!selectionInjection) {
  console.error('Injection for "selection" not found')
  throw new Error('Injection not found')
}
const { selectedIds, multiItemsBoard, updateSelectedIds, updateScrollerY } =
  selectionInjection

const fileUploaderInjection = inject<VFsFileUploaderProvides>('uploader')
if (!fileUploaderInjection) {
  console.error('Injection for "uploader" not found')
  throw new Error('Injection not found')
}
const { setInternalDragStatus } = fileUploaderInjection

const isSelected = computed(() => !!selectedIds.value?.has(props.id))
const selectedItemsCount = computed(() => selectedIds.value?.size ?? 0)

const { onVFsItemMouseDown, onVFsItemClick } = useVFsItemClickChain({
  vFsItemId: props.id,
  isSelected,
  updateSelectedIds,
})

const { isDragging, onDragStart, onDragMove, onDragEnd } = useVFsItemDragChain({
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
    @mousedown="onVFsItemMouseDown"
    @click="onVFsItemClick"
    @dragstart="onDragStart"
    @drag="onDragMove"
    @dragend="onDragEnd"
  >
    <slot :isSelected="isSelected" :id="props.id" />
  </div>
</template>
