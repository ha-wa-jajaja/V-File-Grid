import type { Ref } from 'vue'

export type VFsContainerProps = {
  id: string
}

// export type VFsContainerUpdater =

export type VFsContainerProvides = {
  selectedIds: Ref<Set<string>>
  updateSelectedIds: (
    action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
    id?: string,
  ) => void
}
