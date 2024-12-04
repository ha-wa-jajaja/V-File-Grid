<script setup lang="ts">
import VFileGridFileUploader from './components/VFileGridFileUploader.vue'
import VFileGridContainer from './components/VFileGridContainer.vue'
import VFileGridItem from './components/VFileGridItem.vue'
import { ref } from 'vue'

const allIds = ref([
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
])

const selectedIds = ref(new Set<string>())

function testDrop(files: File[]) {
  console.log(files)
}
</script>

<template>
  <div class="test">
    <VFileGridFileUploader :accept-files="'.jpg'" @dropped-files="testDrop">
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
              :scroller-y="0"
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
