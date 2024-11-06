import type { Ref } from 'vue'

export type VFsContainerProps = {
  id: string
}

export type VFsContainerUpdateSelectedIds = (
  action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
  id?: string,
) => void

export type VFsScrollerYSetter = (val: number) => void

export type VFsContainerProvides = {
  selectedIds: Ref<Set<string>>
  multiItemsBoard: Ref<HTMLElement | null>
  updateSelectedIds: VFsContainerUpdateSelectedIds
  updateScrollerY: VFsScrollerYSetter
}
