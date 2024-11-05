import { ref } from 'vue'

export const useVFsSelection = (allIds: string[]) => {
  const vFsSelectedIds = ref<Set<string>>(new Set())

  function updateVFsSelectedIds(
    action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
    id?: string,
  ) {
    if (action === 'clear') vFsSelectedIds.value.clear()
    else {
      if (!id) throw new Error('Missing ID')
      if (action === 'append') {
        vFsSelectedIds.value.add(id)
        return
      }
      if (action === 'add-multi') {
        const selectedItemIndexes = Array.from(vFsSelectedIds.value).map(id =>
          allIds.findIndex(i => i === id),
        )
        const currItemIdx = allIds.findIndex(i => i === id)
        const firstItemIdx = Math.min(...selectedItemIndexes)
        const lastItemIdx = Math.max(...selectedItemIndexes)

        if ([firstItemIdx, lastItemIdx, currItemIdx].some(n => n < 0))
          throw new Error('Id not found in material list')

        let itemsToAdd

        if (currItemIdx < firstItemIdx) {
          itemsToAdd = allIds.slice(currItemIdx, lastItemIdx)
        } else {
          const startIdx =
            currItemIdx < lastItemIdx ? currItemIdx : lastItemIdx + 1
          const endIdx =
            currItemIdx < lastItemIdx ? lastItemIdx : currItemIdx + 1

          itemsToAdd = allIds.slice(startIdx, endIdx)
        }
        itemsToAdd.forEach(i => vFsSelectedIds.value.add(i))
      }
      if (action === 'select') {
        vFsSelectedIds.value.clear()
        vFsSelectedIds.value.add(id)
      }
      if (action === 'delete') {
        if (vFsSelectedIds.value.has(id)) vFsSelectedIds.value.delete(id)
      }
    }
  }

  return { vFsSelectedIds, updateVFsSelectedIds }
}
