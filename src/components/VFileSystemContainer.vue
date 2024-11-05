<!-- https://vuejs.org/guide/components/slots.html#scoped-slots -->
<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import type { VFsContainerProvides } from '@/types/types'
import { useVFsSelection } from '@/composables/useVFsSelection'
import { useVFsGhostSelector } from '@/composables/useVFsGhostSelector'

const props = defineProps<{
  allIds: string[]
  itemClassName: string
  ghostSelectorBg: string
  containerClassName?: string
}>()

const { vFsSelectedIds, updateVFsSelectedIds } = useVFsSelection(props.allIds)
provide<VFsContainerProvides>('selection', {
  selectedIds: vFsSelectedIds,
  updateSelectedIds: updateVFsSelectedIds,
})

const vFsGhostSelEl = ref<HTMLElement | null>(null)
const {
  isDoingVfsGhostSelect,
  vFsGhostSelectDim,
  toggleVFsGhostSelect,
  updateVFsGhostSelectFrame,
} = useVFsGhostSelector(
  vFsSelectedIds,
  props.allIds,
  vFsGhostSelEl,
  props.itemClassName,
)

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
    if (isDoingVfsGhostSelect.value) {
      isDoingVfsGhostSelect.value = false
      return
    }

    const typedEvent = e as unknown as {
      target: { classList: { contains: (arg: string) => boolean } }
    }
    if (!e.target || !typedEvent.target.classList) return
    if (!typedEvent.target.classList.contains('material-image')) {
      updateVFsSelectedIds('clear')
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

    <slot />
  </section>
</template>

<style scoped>
.v-file-system-container {
  width: 100%;
}

.v-file-system-container__ghost-selector {
  position: fixed;
  background-color: var('--ghost-sel-bg');
  z-index: 9999;
}
</style>
