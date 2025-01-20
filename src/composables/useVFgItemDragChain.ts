import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import type { Ref } from 'vue'

type UseVFgItemDragChainProps = {
  selectedItemsCount: Ref<number>
  scrollerY: Ref<number>
  scrollerYSetter: (val: number) => void
  internalDragSetter: ((bool: boolean) => void) | null
  multiSelectionBackboard: Ref<HTMLElement | null>
}

export const useVFgItemDragChain = ({
  selectedItemsCount,
  scrollerY,
  scrollerYSetter,
  internalDragSetter,
  multiSelectionBackboard,
}: UseVFgItemDragChainProps) => {
  const { height: windowH } = useWindowSize()
  const isDragging = ref(false)

  let moveDragInterval: number | null = null

  function onDragStart(event: DragEvent) {
    event.stopPropagation()
    event.stopImmediatePropagation()

    isDragging.value = true
    if (internalDragSetter) internalDragSetter(true)

    if (multiSelectionBackboard.value && selectedItemsCount.value > 1) {
      event.dataTransfer?.setDragImage(multiSelectionBackboard.value, 50, 50)
    }
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging.value) return

    if (e.clientY < windowH.value * 0.2) {
      if (moveDragInterval) return
      moveDragInterval = setInterval(() => {
        if (scrollerY.value > 20) scrollerYSetter(scrollerY.value - 20)
      }, 80) as unknown as number
    } else {
      if (!moveDragInterval) return
      clearInterval(moveDragInterval)
      moveDragInterval = null
    }
  }

  function onDragEnd() {
    isDragging.value = false
    if (internalDragSetter) internalDragSetter(false)

    if (moveDragInterval) {
      clearInterval(moveDragInterval)
      moveDragInterval = null
    }
  }

  return { isDragging, onDragStart, onDragMove, onDragEnd }
}
