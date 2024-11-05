<!-- https://vuejs.org/guide/components/slots.html#scoped-slots -->
<script setup lang="ts">
import { ref, provide } from 'vue'
import type { VFsContainerProvides } from '@/types/types'

const allIds = ref<string[]>([])
const selectedIds = ref<Set<string>>(new Set())

function updateSelectedIds(
  action: 'clear' | 'select' | 'delete' | 'append' | 'add-multi',
  id?: string,
) {
  if (action === 'clear') selectedIds.value.clear()
  else {
    if (!id) throw new Error('Missing ID')
    if (action === 'append') {
      selectedIds.value.add(id)
      return
    }
    if (action === 'add-multi') {
      const selectedItemIndexes = Array.from(selectedIds.value).map(id =>
        allIds.value.findIndex(i => i === id),
      )
      const currItemIdx = allIds.value.findIndex(i => i === id)
      const firstItemIdx = Math.min(...selectedItemIndexes)
      const lastItemIdx = Math.max(...selectedItemIndexes)

      if ([firstItemIdx, lastItemIdx, currItemIdx].some(n => n < 0))
        throw new Error('Id not found in material list')

      let itemsToAdd

      if (currItemIdx < firstItemIdx) {
        itemsToAdd = allIds.value.slice(currItemIdx, lastItemIdx)
      } else {
        const startIdx =
          currItemIdx < lastItemIdx ? currItemIdx : lastItemIdx + 1
        const endIdx = currItemIdx < lastItemIdx ? lastItemIdx : currItemIdx + 1

        itemsToAdd = allIds.value.slice(startIdx, endIdx)
      }
      itemsToAdd.forEach(i => selectedIds.value.add(i))
    }
    if (action === 'select') {
      selectedIds.value.clear()
      selectedIds.value.add(id)
    }
    if (action === 'delete') {
      if (selectedIds.value.has(id)) selectedIds.value.delete(id)
    }
  }
}

provide<VFsContainerProvides>('selection', {
  selectedIds,
  updateSelectedIds,
})
</script>
