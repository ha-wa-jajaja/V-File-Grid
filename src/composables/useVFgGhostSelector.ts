import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SelectedIdsModel } from '@/types/types'

export type useVFgGhostSelectorProps = {
  selectedIds: SelectedIdsModel
  allIds: Ref<Array<string | number>>
  ghostSelectEl: Ref<HTMLElement | null>
  vFsItemClassName: string
}

export const useVFgGhostSelector = ({
  selectedIds,
  allIds,
  ghostSelectEl,
  vFsItemClassName,
}: useVFgGhostSelectorProps) => {
  const isDoingVfgGhostSelect = ref(false)
  const displayVFgGhostSelect = ref(false)
  const ghostSelectInitX = ref(0)
  const ghostSelectInitY = ref(0)
  const ghostSelectPosX = ref(0)
  const ghostSelectPosY = ref(0)
  const ghostSelectWidth = ref(0)
  const ghostSelectHeight = ref(0)

  function toggleVFgGhostSelect(enable: boolean, e: MouseEvent) {
    if (enable) {
      isDoingVfgGhostSelect.value = true

      ghostSelectInitX.value = e.clientX
      ghostSelectInitY.value = e.clientY
      ghostSelectPosX.value = e.clientX
      ghostSelectPosY.value = e.clientY
    } else {
      if (isDoingVfgGhostSelect.value && !displayVFgGhostSelect.value)
        isDoingVfgGhostSelect.value = false
      ghostSelectPosX.value = 0
      ghostSelectPosY.value = 0
      ghostSelectWidth.value = 0
      ghostSelectHeight.value = 0
    }
  }

  function endVfsGhostSelect() {
    isDoingVfgGhostSelect.value = false
    displayVFgGhostSelect.value = false
  }

  const { doCheckItemCollide } = useCheckVFgItemCollide()

  function updateVFgGhostSelectFrame(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    if (!isDoingVfgGhostSelect.value) return

    displayVFgGhostSelect.value = true

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

    const vFsItems = document.querySelectorAll('.' + vFsItemClassName)

    Array.from(vFsItems).forEach((item, index) => {
      if (!item || !selectedIds.value) return

      const collided =
        ghostSelectEl.value && doCheckItemCollide(ghostSelectEl.value, item)

      const itemId = allIds.value[index]
      if (!itemId) throw new Error('Item id is not found')

      const isSelected = selectedIds.value.has(itemId)

      if (collided && !isSelected) {
        selectedIds.value.add(itemId)
      } else if (!collided && isSelected) {
        selectedIds.value.delete(itemId)
      }
    })
  }

  function useCheckVFgItemCollide() {
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
      const selectorTop = getElOffset(selector)?.top
      const selectorLeft = getElOffset(selector)?.left
      const itemTop = getElOffset(item)?.top
      const itemLeft = getElOffset(item)?.left

      const itemDim = getElDim(item)
      const selectorDim = getElDim(selector)
      if (
        !itemDim ||
        !selectorDim ||
        !selectorTop ||
        !selectorLeft ||
        !itemTop ||
        !itemLeft
      )
        return false
      return !(
        selectorTop + selectorDim.height < itemTop ||
        selectorTop > itemTop + itemDim.height ||
        selectorLeft + selectorDim.width < itemLeft ||
        selectorLeft > itemLeft + itemDim.width
      )
    }

    return { doCheckItemCollide }
  }

  return {
    isDoingVfgGhostSelect,
    displayVFgGhostSelect,
    endVfsGhostSelect,
    vFsGhostSelectDim: {
      ghostSelectInitX,
      ghostSelectInitY,
      ghostSelectPosX,
      ghostSelectPosY,
      ghostSelectWidth,
      ghostSelectHeight,
    },
    toggleVFgGhostSelect,
    updateVFgGhostSelectFrame,
  }
}
