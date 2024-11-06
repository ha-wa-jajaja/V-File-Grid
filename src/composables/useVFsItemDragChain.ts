import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import type { Ref } from 'vue'

type UseVFsItemDragChainProps = {
  itemId: string
  selectedItemsCount: Ref<number>
  scrollerY: number
  scrollerYSetter: (val: number) => void
  multiSelectionBackboard: Ref<HTMLElement | null>
}

export const useVFsItemDragChain = ({
  itemId,
  selectedItemsCount,
  scrollerY,
  scrollerYSetter,
  multiSelectionBackboard,
}: UseVFsItemDragChainProps) => {
  const { height: windowH } = useWindowSize()
  const isDragging = ref(false)

  let moveDragInterval: number | null = null

  function onDragStart(event: DragEvent) {
    event.stopPropagation()
    event.stopImmediatePropagation()

    isDragging.value = true

    if (multiSelectionBackboard.value && selectedItemsCount.value > 1) {
      event.dataTransfer?.setDragImage(multiSelectionBackboard.value, 50, 50)
    }

    event?.dataTransfer?.setData('itemId', itemId)
  }

  function onDragMove(e: MouseEvent) {
    if (!isDragging.value) return

    if (e.clientY < windowH.value * 0.2) {
      if (moveDragInterval) return
      moveDragInterval = setInterval(() => {
        if (scrollerY > 20) scrollerYSetter(scrollerY - 20)
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
