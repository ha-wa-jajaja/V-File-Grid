import type { Ref, ModelRef } from 'vue'

export type VFsContainerProps = {
  id: string
}

export type VFsContainerUpdateSelectedIds = (
  action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
  id?: string,
) => void

export type VFsScrollerYSetter = (val: number) => void
export type SelectedIdsModel = ModelRef<Set<string> | undefined>

export type VFsContainerProvides = {
  selectedIds: SelectedIdsModel
  multiItemsBoard: Ref<HTMLElement | null>
  updateSelectedIds: VFsContainerUpdateSelectedIds
  updateScrollerY: VFsScrollerYSetter
}

export type VFsFileUploaderProvides = {
  isInternalDragging: Ref<boolean>
  setInternalDragStatus: (bool: boolean) => void
}
