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
const computedScrollerY = computed(() => props.scrollerY)

const emits = defineEmits<{
  onItemDragStateChange: [status: boolean]
}>()

// PROVIDE: VFgContainerProvides
const selectionInjection = inject<VFgContainerProvides>('selection')
if (!selectionInjection) {
  console.error('Injection for "selection" not found')
  throw new Error('Injection not found')
}
const { selectedIds, multiItemsBoard, updateSelectedIds, updateScrollerY } =
  selectionInjection

// PROVIDE: VFgFileUploaderProvides
let internalDragSetter = null
const fileUploaderInjection = inject<VFgFileUploaderProvides>('uploader')
if (fileUploaderInjection) {
  const { setInternalDragStatus } = fileUploaderInjection
  internalDragSetter = setInternalDragStatus
}

const isSelected = computed(() => !!selectedIds.value?.has(props.id))
const selectedItemsCount = computed(() => selectedIds.value?.size ?? 0)

const { onVFgItemMouseDown, onVFgItemClick } = useVFgItemClickChain({
  vFsItemId: props.id,
  isSelected,
  updateSelectedIds,
})

const { isDragging, onDragStart, onDragMove, onDragEnd } = useVFgItemDragChain({
  selectedItemsCount,
  scrollerY: computedScrollerY,
  scrollerYSetter: updateScrollerY,
  multiSelectionBackboard: multiItemsBoard,
  internalDragSetter,
})

watch(isDragging, v => {
  emits('onItemDragStateChange', v)
})
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
