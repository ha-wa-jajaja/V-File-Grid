<!-- https://vuejs.org/guide/components/slots.html#scoped-slots -->
<script setup lang="ts">
import { computed, onMounted, provide, ref, defineModel } from 'vue'
import type { VFgContainerProvides } from '@/types/types'
import { useVFgSelection } from '@/composables/useVFgSelection'
import { useVFgGhostSelector } from '@/composables/useVFgGhostSelector'

const props = withDefaults(
  defineProps<{
    allIds: string[]
    itemClassName: string
    ghostSelectorBg: string
    containerClassName?: string
    cols?: number
    gap?: string | number
  }>(),
  {
    cols: 6,
    gap: 24,
  },
)

const gapValue = computed(() => {
  if (typeof props.gap === 'number') return `${props.gap}px`
  return props.gap
})

const emits = defineEmits(['updateScrollerY'])

const multiItemsBoard = ref<HTMLElement | null>(null)

const selectedIdModel = defineModel<Set<string>>()

const { updateSelectedIdModel } = useVFgSelection(selectedIdModel, props.allIds)
provide<VFgContainerProvides>('selection', {
  selectedIds: selectedIdModel,
  updateSelectedIds: updateSelectedIdModel,
  multiItemsBoard,
  updateScrollerY: (val: number) => {
    emits('updateScrollerY', val)
  },
})

const vFsGhostSelEl = ref<HTMLElement | null>(null)

const {
  isDoingVfsGhostSelect,
  displayVFgGhostSelect,
  vFsGhostSelectDim,
  endVfsGhostSelect,
  toggleVFgGhostSelect,
  updateVFgGhostSelectFrame,
} = useVFgGhostSelector({
  selectedIds: selectedIdModel,
  allIds: props.allIds,
  ghostSelectEl: vFsGhostSelEl,
  vFsItemClassName: props.itemClassName,
})

const {
  ghostSelectInitX,
  ghostSelectInitY,
  ghostSelectPosX,
  ghostSelectPosY,
  ghostSelectWidth,
  ghostSelectHeight,
} = vFsGhostSelectDim

function setVfsClearClickAction() {
  window.addEventListener('click', e => {
    e.stopPropagation()

    if (isDoingVfsGhostSelect.value && displayVFgGhostSelect.value) {
      endVfsGhostSelect()
      return
    }

    const typedEvent = e as unknown as {
      target: { classList: { contains: (arg: string) => boolean } }
    }

    if (!e.target || !typedEvent.target.classList) return
    if (!typedEvent.target.classList.contains(props.itemClassName)) {
      updateSelectedIdModel('clear')
    }
  })
}

onMounted(() => {
  setVfsClearClickAction()
})
</script>

<template>
  <section
    class="v-file-grid-container"
    :class="props.containerClassName"
    @mousedown="toggleVFgGhostSelect(true, $event)"
    @mouseup="toggleVFgGhostSelect(false, $event)"
    @mousemove="
      updateVFgGhostSelectFrame(
        $event.clientX,
        $event.clientY,
        ghostSelectInitX,
        ghostSelectInitY,
      )
    "
  >
    <div
      ref="vFsGhostSelEl"
      class="v-file-grid-container__ghost-selector"
      v-show="displayVFgGhostSelect"
      :style="{
        top: `${ghostSelectPosY}px`,
        left: `${ghostSelectPosX}px`,
        width: `${ghostSelectWidth}px`,
        height: `${ghostSelectHeight}px`,
        '--ghost-sel-bg': props.ghostSelectorBg,
      }"
    ></div>

    <div
      class="v-file-grid__items"
      :style="{
        '--v-items-grid-cols': props.cols,
        '--v-items-grid-gap': gapValue,
      }"
    >
      <slot name="items" />
    </div>

    <div class="v-file-grid-container__multi-items-board" ref="multiItemsBoard">
      <slot name="multiItemsBoard" />
    </div>
  </section>
</template>

<style scoped>
.v-file-grid-container {
  width: 100%;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.v-file-grid-container__ghost-selector {
  position: fixed;
  background-color: var(--ghost-sel-bg);
  z-index: 9999;
}

.v-file-grid-container__multi-items-board {
  position: fixed;
  z-index: -1;
  top: 100%;
  left: 100%;
}

.v-file-grid__items {
  display: grid;
  grid-template-columns: repeat(var(--v-items-grid-cols), minmax(0, 1fr));
  gap: var(--v-items-grid-gap);
}
</style>
