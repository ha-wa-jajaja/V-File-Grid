import type { VFsContainerUpdateSelectedIds } from '@/types/types'
import type { Ref } from 'vue'

export type UseVFsItemClickChainProps = {
  vFsItemId: string
  isSelected: Ref<boolean>
  updateSelectedIds: VFsContainerUpdateSelectedIds
}

export const useVFsItemClickChain = ({
  vFsItemId,
  isSelected,
  updateSelectedIds,
}: UseVFsItemClickChainProps) => {
  let isMouseDownAction = false

  function onVFsItemMouseDown(e: MouseEvent) {
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

  function onVFsItemClick() {
    if (isMouseDownAction) {
      isMouseDownAction = false
      return
    }
    if (isSelected.value) updateSelectedIds('select', vFsItemId)
  }

  return { onVFsItemMouseDown, onVFsItemClick }
}
