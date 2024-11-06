<script setup lang="ts">
import VFileSystemContainer from './components/VFileSystemContainer.vue'
import VFileSystemItem from './components/VFileSystemItem.vue'
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
</script>

<template>
  <div class="test">
    <VFileSystemContainer
      v-model="selectedIds"
      :all-ids="allIds"
      :item-class-name="'test-item'"
      :ghost-selector-bg="'#FF0000'"
    >
      <template #items>
        <VFileSystemItem
          v-for="id in allIds"
          :key="id"
          :id="id"
          :scroller-y="0"
          v-slot="slotProps"
        >
          <div class="test-item" :class="{ selected: slotProps.isSelected }">
            {{ id }}
          </div>
        </VFileSystemItem>
      </template>
    </VFileSystemContainer>
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
</style>
