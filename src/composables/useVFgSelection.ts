import type { SelectedIdsModel } from '@/types/types'
import type { Ref } from 'vue'

export const useVFgSelection = (
  selectedIdModel: SelectedIdsModel,
  allIds: Ref<Array<string | number>>,
) => {
  function updateSelectedIdModel(
    action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
    id?: string,
  ) {
    if (!selectedIdModel.value) {
      throw new Error('SelectedIdsModel is not defined')
    }
    if (action === 'clear') selectedIdModel.value.clear()
    else {
      if (!id) throw new Error('Missing ID')
      if (action === 'append') {
        selectedIdModel.value.add(id)
        return
      }
      if (action === 'add-multi') {
        const selectedItemIndexes = Array.from(selectedIdModel.value).map(id =>
          allIds.value.findIndex(i => i === id),
        )
        const currItemIdx = allIds.value.findIndex(i => i === id)
        const firstItemIdx = Math.min(...selectedItemIndexes)
        const lastItemIdx = Math.max(...selectedItemIndexes)

        if ([firstItemIdx, lastItemIdx, currItemIdx].some(n => n < 0))
          throw new Error('Id not found in id list')

        let itemsToAdd

        if (currItemIdx < firstItemIdx) {
          itemsToAdd = allIds.value.slice(currItemIdx, lastItemIdx)
        } else {
          const startIdx =
            currItemIdx < lastItemIdx ? currItemIdx : lastItemIdx + 1
          const endIdx =
            currItemIdx < lastItemIdx ? lastItemIdx : currItemIdx + 1

          itemsToAdd = allIds.value.slice(startIdx, endIdx)
        }
        itemsToAdd.forEach(i => selectedIdModel.value?.add(i))
      }
      if (action === 'select') {
        selectedIdModel.value.clear()
        selectedIdModel.value.add(id)
      }
      if (action === 'delete') {
        if (selectedIdModel.value.has(id)) selectedIdModel.value.delete(id)
      }
    }
  }

  return { updateSelectedIdModel }
}
