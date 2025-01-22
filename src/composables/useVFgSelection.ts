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

  function handleMultiSelection(
    selectedIds: Set<string | number>,
    targetId: string | number,
  ) {
    const selectedItemIndexes: number[] = []
    let targetIdIdx = -1
    let firstItemIdx = Infinity
    let lastItemIdx = -1

    allIds.value.forEach((id, idx) => {
      if (selectedIds.has(id)) {
        selectedItemIndexes.push(idx)
        firstItemIdx = Math.min(firstItemIdx, idx)
        lastItemIdx = Math.max(lastItemIdx, idx)
      }
      if (id === targetId) targetIdIdx = idx
    })

    if ([firstItemIdx, lastItemIdx, targetIdIdx].some(n => n < 0))
      throw new Error('Selected list has mismatch with allIds list')

    let itemsToAdd
    if (targetIdIdx < firstItemIdx) {
      itemsToAdd = allIds.value.slice(targetIdIdx, lastItemIdx)
    } else {
      const startIdx = targetIdIdx < lastItemIdx ? targetIdIdx : lastItemIdx + 1
      const endIdx = targetIdIdx < lastItemIdx ? lastItemIdx : targetIdIdx + 1

      itemsToAdd = allIds.value.slice(startIdx, endIdx)
    }

    itemsToAdd.forEach(i => selectedIdModel.value?.add(i))
  }

  return { updateSelectedIdModel }
}
