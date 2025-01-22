import type { Ref } from 'vue'
import type { VFgAutoScrollEl, VFgAutoScrollConfig } from '@/types/types'
import {
  useWindowSize,
  useWindowScroll,
  useElementBounding,
  useScroll,
  useMouseInElement,
} from '@vueuse/core'
import { ref } from 'vue'

type UseVFgItemDragChainProps = {
  selectedItemsCount: Ref<number>
  internalDragSetter: ((bool: boolean) => void) | null
  multiSelectionBackboard: Ref<HTMLElement | null>
  scroller: Ref<VFgAutoScrollEl>
  scrollConfig: VFgAutoScrollConfig
}

export const useVFgItemDragChain = ({
  selectedItemsCount,
  internalDragSetter,
  multiSelectionBackboard,
  scroller,
  scrollConfig,
}: UseVFgItemDragChainProps) => {
  const isDragging = ref(false)

  function onDragStart(event: DragEvent) {
    event.stopPropagation()
    event.stopImmediatePropagation()

    isDragging.value = true
    if (internalDragSetter) internalDragSetter(true)

    if (multiSelectionBackboard.value && selectedItemsCount.value > 1) {
      event.dataTransfer?.setDragImage(multiSelectionBackboard.value, 50, 50)
    }
  }

  let moveDragAnimation: number | null = null
  const autoScrollThreshold = clamp(scrollConfig.scrollThreshold || 0.2, 0, 0.5)
  const autoScrollSpeed = scrollConfig.scrollSpeed || 1

  function clearMoveDragAnim() {
    if (!moveDragAnimation) return
    cancelAnimationFrame(moveDragAnimation)
    moveDragAnimation = null
  }

  const autoScrollSensor = useAutoScrollSensor(scroller)
  function onDragMove(e: MouseEvent) {
    if (!isDragging.value || !autoScrollSensor) return
    const { scrollerHeight, scrollerScrolledY, getMousePosition } =
      autoScrollSensor

    const inScrollTopRegion =
      clamp(
        getMousePosition(e),
        0,
        scrollerHeight.value * autoScrollThreshold,
      ) === getMousePosition(e)

    const inScrollBottomRegion =
      clamp(
        getMousePosition(e),
        scrollerHeight.value * (1 - autoScrollThreshold),
        scrollerHeight.value,
      ) === getMousePosition(e)

    if (!inScrollTopRegion && !inScrollBottomRegion) {
      clearMoveDragAnim()
      return
    }

    if (moveDragAnimation) return

    let movePerFrame = 0
    if (inScrollTopRegion) movePerFrame = -autoScrollSpeed
    if (inScrollBottomRegion) movePerFrame = autoScrollSpeed

    function doScroll() {
      scrollerScrolledY.value += movePerFrame
      moveDragAnimation = requestAnimationFrame(doScroll)
    }

    moveDragAnimation = requestAnimationFrame(doScroll)
  }

  function onDragEnd() {
    isDragging.value = false
    if (internalDragSetter) internalDragSetter(false)
    clearMoveDragAnim()
  }

  return { isDragging, onDragStart, onDragMove, onDragEnd }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function useAutoScrollSensor(scroller: Ref<VFgAutoScrollEl>) {
  if (!scroller) {
    console.warn('No scroller provided for auto-scrolling')
    return
  }

  let scrollerHeight: Ref<number>
  let scrollerScrolledY: Ref<number>
  let scrollerMouseYPos: Ref<number>

  if (scroller.value === 'window') {
    scrollerHeight = useWindowSize().height
    scrollerScrolledY = useWindowScroll().y
  } else {
    scrollerMouseYPos = useMouseInElement(scroller.value).elementY
    scrollerHeight = useElementBounding(scroller.value).height
    scrollerScrolledY = useScroll(scroller.value).y
  }

  function getMousePosition(e: MouseEvent) {
    if (scroller.value === 'window') return e.clientY
    else return scrollerMouseYPos.value
  }

  return { scrollerHeight, scrollerScrolledY, getMousePosition }
}
