<!-- https://vuejs.org/guide/components/slots.html#scoped-slots -->
<script setup lang="ts">
import { computed, onMounted, provide, ref, defineModel, watch } from 'vue'
import type { VFsContainerProvides } from '@/types/types'
import { useVFsSelection } from '@/composables/useVFsSelection'
import { useVFsGhostSelector } from '@/composables/useVFsGhostSelector'

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

const { updateSelectedIdModel } = useVFsSelection(selectedIdModel, props.allIds)
provide<VFsContainerProvides>('selection', {
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
  vFsGhostSelectDim,
  toggleVFsGhostSelect,
  updateVFsGhostSelectFrame,
} = useVFsGhostSelector({
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

// watch(isDoingVfsGhostSelect, v => {
//   // console.log('Ghost select:', v)
// })

// FIXME: Clear all logic
// FIXME: Work on ghost selecting and cursor moves outta container
function setVfsClearClickAction() {
  window.addEventListener('click', e => {
    // console.log('on click fires')
    // e.stopImmediatePropagation()
    e.stopPropagation()

    if (isDoingVfsGhostSelect.value) {
      isDoingVfsGhostSelect.value = false
      // console.log('Ghost select ends')
      return
    }

    const typedEvent = e as unknown as {
      target: { classList: { contains: (arg: string) => boolean } }
    }
    console.log(typedEvent.target.classList)
    console.log(typedEvent.target.classList.contains(props.itemClassName))

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
    class="v-file-system-container"
    :class="props.containerClassName"
    @mousedown="toggleVFsGhostSelect(true, $event)"
    @mouseup="toggleVFsGhostSelect(false, $event)"
    @mousemove="
      updateVFsGhostSelectFrame(
        $event.pageX,
        $event.pageY,
        ghostSelectInitX,
        ghostSelectInitY,
      )
    "
  >
    <div
      ref="vFsGhostSelEl"
      class="v-file-system-container__ghost-selector"
      :style="{
        top: `${ghostSelectPosY}px`,
        left: `${ghostSelectPosX}px`,
        width: `${ghostSelectWidth}px`,
        height: `${ghostSelectHeight}px`,
        '--ghost-sel-bg': props.ghostSelectorBg,
      }"
    ></div>

    <div
      class="v-file-system__items"
      :style="{
        '--v-items-grid-cols': props.cols,
        '--v-items-grid-gap': gapValue,
      }"
    >
      <slot name="items" />
    </div>

    <div
      class="v-file-system-container__multi-items-board"
      ref="multiItemsBoard"
    >
      <slot name="multiItemsBoard" />
    </div>
  </section>
</template>

<style scoped>
.v-file-system-container {
  width: 100%;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.v-file-system-container__ghost-selector {
  position: fixed;
  background-color: var(--ghost-sel-bg);
  z-index: 9999;
}

.v-file-system-container__multi-items-board {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
}

.v-file-system__items {
  display: grid;
  grid-template-columns: repeat(var(--v-items-grid-cols), minmax(0, 1fr));
  gap: var(--v-items-grid-gap);
}
</style>
