import type { Ref, ModelRef } from 'vue'

export type VFgContainerProps = {
  id: string
}

export type VFgContainerUpdateSelectedIds = (
  action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
  id?: string,
) => void

export type VFgScrollerYSetter = (val: number) => void
export type SelectedIdsModel = ModelRef<Set<string | number> | undefined>

export type VFgContainerProvides = {
  selectedIds: SelectedIdsModel
  multiItemsBoard: Ref<HTMLElement | null>
  updateSelectedIds: VFgContainerUpdateSelectedIds
  updateScrollerY: VFgScrollerYSetter
}

export type VFgFileUploaderProvides = {
  isInternalDragging: Ref<boolean>
  setInternalDragStatus: (bool: boolean) => void
}
