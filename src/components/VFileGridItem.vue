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
}>()

const emits = defineEmits<{
  onItemDragStateChange: [status: boolean]
}>()

// PROVIDE: VFgContainerProvides
const containerInjection = inject<VFgContainerProvides>('container')
if (!containerInjection) {
  console.error('Injection for "selection" not found')
  throw new Error('Injection not found')
}
const {
  selectedIds,
  multiItemsBoard,
  updateSelectedIds,
  scroller,
  scrollConfig,
} = containerInjection

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
  multiSelectionBackboard: multiItemsBoard,
  internalDragSetter,
  scroller,
  scrollConfig,
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
