import { ref } from 'vue'
import type { Ref } from 'vue'

export type useVFsGhostSelectorProps = {
  selectedIds: Ref<Set<string>>
  allIds: string[]
  ghostSelectEl: Ref<HTMLElement | null>
  vFsItemClassName: string
}

export const useVFsGhostSelector = ({
  selectedIds,
  allIds,
  ghostSelectEl,
  vFsItemClassName,
}: useVFsGhostSelectorProps) => {
  const isDoingVfsGhostSelect = ref(false)
  const ghostSelectInitX = ref(0)
  const ghostSelectInitY = ref(0)
  const ghostSelectPosX = ref(0)
  const ghostSelectPosY = ref(0)
  const ghostSelectWidth = ref(0)
  const ghostSelectHeight = ref(0)

  function toggleVFsGhostSelect(enable: boolean, e: MouseEvent) {
    if (enable) {
      isDoingVfsGhostSelect.value = true

      ghostSelectInitX.value = e.pageX
      ghostSelectInitY.value = e.pageY
      ghostSelectPosX.value = e.pageX
      ghostSelectPosY.value = e.pageY
    } else {
      ghostSelectPosX.value = 0
      ghostSelectPosY.value = 0
      ghostSelectWidth.value = 0
      ghostSelectHeight.value = 0
    }
  }

  const { doCheckItemCollide } = useCheckVFsItemCollide()

  function updateVFsGhostSelectFrame(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    if (!isDoingVfsGhostSelect.value) return
    const w = Math.abs(width - x)
    const h = Math.abs(height - y)

    ghostSelectWidth.value = w
    ghostSelectHeight.value = h

    if (x <= width && y >= height) {
      ghostSelectPosX.value = x
    } else if (y <= height && x >= width) {
      ghostSelectPosY.value = y
    } else if (y < height && x < width) {
      ghostSelectPosX.value = x
      ghostSelectPosY.value = y
    }

    const vFsItems = document.querySelectorAll(vFsItemClassName)
    Array.from(vFsItems).forEach((item, index) => {
      if (!item) return

      const collided =
        ghostSelectEl.value && doCheckItemCollide(ghostSelectEl.value, item)
      const itemId = allIds.at(index)
      if (!itemId) throw new Error('Item id is not found')

      const isSelected = selectedIds.value.has(itemId)

      if (collided && !isSelected) {
        selectedIds.value.add(itemId)
      } else if (!collided && isSelected) {
        selectedIds.value.delete(itemId)
      }
    })
  }

  function useCheckVFsItemCollide() {
    function getElOffset(el: Element) {
      if (!el) return

      const rect = el.getBoundingClientRect()
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
      }
    }

    function getElDim(el: Element) {
      if (!el) return

      const style = getComputedStyle(el)
      return {
        height: parseInt(style.height),
        width: parseInt(style.width),
      }
    }

    function doCheckItemCollide(selector: HTMLElement, item: Element) {
      const aTop = getElOffset(selector)?.top
      const aLeft = getElOffset(selector)?.left
      const bTop = getElOffset(item)?.top
      const bLeft = getElOffset(item)?.left

      const itemDim = getElDim(item)
      const selectorDim = getElDim(selector)
      if (!itemDim || !selectorDim || !aTop || !aLeft || !bTop || !bLeft)
        return false
      return !(
        aTop + selectorDim.height < bTop ||
        aTop > bTop + itemDim.height ||
        aLeft + selectorDim.width < bLeft ||
        aLeft > bLeft + itemDim.width
      )
    }

    return { doCheckItemCollide }
  }

  return {
    isDoingVfsGhostSelect,
    vFsGhostSelectDim: {
      ghostSelectInitX,
      ghostSelectInitY,
      ghostSelectPosX,
      ghostSelectPosY,
      ghostSelectWidth,
      ghostSelectHeight,
    },
    toggleVFsGhostSelect,
    updateVFsGhostSelectFrame,
  }
}
