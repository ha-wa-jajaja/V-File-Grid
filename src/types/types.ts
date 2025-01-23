import type { Ref, ModelRef } from 'vue'

export type VFgContainerProps = {
  id: string
}

export type VFgContainerUpdateSelectedIds = (
  action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
  id?: string,
) => void

export type SelectedIdsModel = ModelRef<Set<string | number> | undefined>

export type VFgAutoScrollEl = 'window' | HTMLElement | null
export type VFgAutoScrollConfig = {
  /** Auto scrolling in pixels per requestAnimationFrame. Default as 5 */
  scrollSpeed?: number
  /** The threshold of the scrollable area that triggers auto scrolling; between 0 and 0.5 */
  scrollThreshold?: number
}

export type VFgContainerProvides = {
  selectedIds: SelectedIdsModel
  multiItemsBoard: Ref<HTMLElement | null>
  updateSelectedIds: VFgContainerUpdateSelectedIds
  scroller: Ref<VFgAutoScrollEl>
  scrollConfig: VFgAutoScrollConfig
}

export type VFgFileUploaderProvides = {
  isInternalDragging: Ref<boolean>
  setInternalDragStatus: (bool: boolean) => void
}
