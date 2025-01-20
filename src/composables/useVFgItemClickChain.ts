import type { VFgContainerUpdateSelectedIds } from '@/types/types'
import type { Ref } from 'vue'

export type UseVFgItemClickChainProps = {
  vFsItemId: string
  isSelected: Ref<boolean>
  updateSelectedIds: VFgContainerUpdateSelectedIds
}

export const useVFgItemClickChain = ({
  vFsItemId,
  isSelected,
  updateSelectedIds,
}: UseVFgItemClickChainProps) => {
  let isMouseDownAction = false

  function onVFgItemMouseDown(e: MouseEvent) {
    e.stopPropagation()
    if (isSelected.value) return

    isMouseDownAction = true

    if (e.ctrlKey || e.metaKey) {
      updateSelectedIds('append', vFsItemId)
      return
    }

    if (e.shiftKey) {
      updateSelectedIds('add-multi', vFsItemId)
      return
    }

    updateSelectedIds('select', vFsItemId)
  }

  function onVFgItemClick() {
    if (isMouseDownAction) {
      isMouseDownAction = false
      return
    }
    if (isSelected.value) updateSelectedIds('select', vFsItemId)
  }

  return { onVFgItemMouseDown, onVFgItemClick }
}
