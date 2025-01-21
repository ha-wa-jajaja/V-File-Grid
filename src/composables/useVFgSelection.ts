import type { SelectedIdsModel } from '@/types/types'
import type { Ref } from 'vue'

export const useVFgSelection = (
  selectedIdModel: SelectedIdsModel,
  allIds: Ref<Array<string | number>>,
) => {
  function handleMultiSelection(
    selectedIds: Set<string | number>,
    targetId: string | number,
  ) {
    const selectedItemIndexes = Array.from(selectedIds).map(selectedId =>
      allIds.value.findIndex(i => i === selectedId),
    )
    const currItemIdx = allIds.value.findIndex(i => i === targetId)
    const firstItemIdx = Math.min(...selectedItemIndexes)
    const lastItemIdx = Math.max(...selectedItemIndexes)

    if ([firstItemIdx, lastItemIdx, currItemIdx].some(n => n < 0))
      throw new Error('Id not found in id list')

    let itemsToAdd

    if (currItemIdx < firstItemIdx) {
      itemsToAdd = allIds.value.slice(currItemIdx, lastItemIdx)
    } else {
      const startIdx = currItemIdx < lastItemIdx ? currItemIdx : lastItemIdx + 1
      const endIdx = currItemIdx < lastItemIdx ? lastItemIdx : currItemIdx + 1

      itemsToAdd = allIds.value.slice(startIdx, endIdx)
    }
    itemsToAdd.forEach(i => selectedIdModel.value?.add(i))
  }

  function updateSelectedIdModel(
    action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
    id?: string,
  ) {
    if (!selectedIdModel.value)
      throw new Error('SelectedIdsModel is not invalid')

    if (action === 'clear') {
      selectedIdModel.value.clear()
      return
    }

    if (!id) throw new Error('Missing ID for action ' + action)

    if (action === 'append') {
      selectedIdModel.value.add(id)
      return
    }

    if (action === 'add-multi') {
      handleMultiSelection(selectedIdModel.value, id)
    }

    if (action === 'select') {
      selectedIdModel.value.clear()
      selectedIdModel.value.add(id)
    }

    if (action === 'delete') {
      if (selectedIdModel.value.has(id)) selectedIdModel.value.delete(id)
    }
  }

  return { updateSelectedIdModel }
}
