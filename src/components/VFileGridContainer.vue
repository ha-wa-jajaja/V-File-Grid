<!-- https://vuejs.org/guide/components/slots.html#scoped-slots -->
<script setup lang="ts">
import { computed, onMounted, provide, ref, defineModel, toRef } from 'vue'
import type {
  VFgContainerProvides,
  VFgAutoScrollEl,
  VFgAutoScrollConfig,
} from '@/types/types'
import { useVFgSelection } from '@/composables/useVFgSelection'
import { useVFgGhostSelector } from '@/composables/useVFgGhostSelector'

const props = withDefaults(
  defineProps<{
    allIds: Array<string | number>
    itemClassName: string
    ghostSelectorBg: string
    containerClassName?: string
    scroller?: VFgAutoScrollEl
    scrollerConfig?: VFgAutoScrollConfig
    cols?: number
    gap?: string | number
    padding?: string
  }>(),
  {
    cols: 6,
    gap: 24,
    padding: '40px',
    scroller: 'window',
    scrollerConfig: () => ({
      scrollSpeed: 5,
      scrollThreshold: 0.2,
    }),
  },
)
const allIds = toRef(props, 'allIds')
const scroller = toRef(props, 'scroller')

const gapValue = computed(() => {
  if (typeof props.gap === 'number') return `${props.gap}px`
  return props.gap
})

const multiItemsBoard = ref<HTMLElement | null>(null)

const selectedIdModel = defineModel<Set<string>>()

const { updateSelectedIdModel } = useVFgSelection(selectedIdModel, allIds)
provide<VFgContainerProvides>('container', {
  selectedIds: selectedIdModel,
  updateSelectedIds: updateSelectedIdModel,
  multiItemsBoard,
  scroller,
  scrollConfig: props.scrollerConfig,
})

const vFsGhostSelEl = ref<HTMLElement | null>(null)

const {
  isDoingVfgGhostSelect,
  displayVFgGhostSelect,
  vFsGhostSelectDim,
  endVfsGhostSelect,
  toggleVFgGhostSelect,
  updateVFgGhostSelectFrame,
} = useVFgGhostSelector({
  selectedIds: selectedIdModel,
  allIds,
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

    if (isDoingVfgGhostSelect.value && displayVFgGhostSelect.value) {
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
    :style="{
      '--vfg-container-padding': props.padding,
    }"
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
  padding: var(--vfg-container-padding);
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
