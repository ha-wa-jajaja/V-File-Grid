<script setup lang="ts">
import VFileGridFileUploader from './components/VFileGridFileUploader.vue'
import VFileGridContainer from './components/VFileGridContainer.vue'
import VFileGridItem from './components/VFileGridItem.vue'
import { ref, onMounted, nextTick } from 'vue'

const allIds = ref<string[]>([])

const selectedIds = ref(new Set<string>())

const wrapper = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    allIds.value = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ]
  }, 1000)
})
</script>

<template>
  <div class="test" ref="wrapper">
    <VFileGridFileUploader :accept-files="'.jpg'">
      <template #board>test</template>
      <template #content>
        <VFileGridContainer
          v-model="selectedIds"
          :all-ids="allIds"
          :item-class-name="'test-item'"
          :ghost-selector-bg="'#FF0000'"
        >
          <template #items>
            <VFileGridItem
              v-for="id in allIds"
              :key="id"
              :id="id"
              v-slot="slotProps"
            >
              <div
                class="test-item"
                :class="{ selected: slotProps.isSelected }"
              >
                {{ id }}
              </div>
            </VFileGridItem>
          </template>

          <template #multiItemsBoard>
            <div class="multi-board">{{ selectedIds.size }}</div>
          </template>
        </VFileGridContainer>
      </template>
    </VFileGridFileUploader>
  </div>
</template>

<style scoped>
.test {
  width: 100%;
  /* height: 50vh;
  overflow: scroll;
  margin-top: 50vh; */
}

.test-item {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: azure;
}

.test-item.selected {
  background-color: lightcoral;
}

.multi-board {
  background-color: greenyellow;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
}
</style>
