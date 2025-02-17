<script setup lang="ts">
import type { VFgFileUploaderProvides } from '@/types/types'
import { provide, ref } from 'vue'

const props = defineProps<{
  disableUpload?: boolean
}>()

const emits = defineEmits<{
  droppedFiles: [
    { files: FileSystemFileEntry[]; folders: FileSystemDirectoryEntry[] },
  ]
}>()

const showDropUploadBoard = ref(false)
const isInternalDragging = ref(false)
let ableToClose = false

function setUploadBoard(status: boolean) {
  showDropUploadBoard.value = status
}

function setInternalDragStatus(bool: boolean) {
  isInternalDragging.value = bool
}

function overAction(event: Event, bool: boolean) {
  event.preventDefault()
  event.stopImmediatePropagation()
  if (isInternalDragging.value || props.disableUpload) return

  if (bool) {
    ableToClose = false
    setUploadBoard(true)
  } else {
    if (!ableToClose) {
      ableToClose = true
      return
    }
    setUploadBoard(false)
  }
}

provide<VFgFileUploaderProvides>('uploader', {
  isInternalDragging,
  setInternalDragStatus,
})

function emitFiles(event: DragEvent) {
  event.preventDefault()
  event.stopImmediatePropagation()

  if (!event.dataTransfer?.items || props.disableUpload) return

  const files: FileSystemFileEntry[] = []
  const folders: FileSystemDirectoryEntry[] = []

  Array.from(event.dataTransfer.items).forEach(item => {
    const entry = item.webkitGetAsEntry()
    if (!entry) throw new Error('Failed to get entry')

    if (entry.isFile) {
      files.push(entry as FileSystemFileEntry)
    } else if (entry.isDirectory) {
      folders.push(entry as FileSystemDirectoryEntry)
    }
  })

  emits('droppedFiles', { files, folders })

  setUploadBoard(false)
}
</script>

<template>
  <div
    class="v-file-grid__uploader"
    @dragover.prevent
    @dragenter="overAction($event, true)"
    @dragleave="overAction($event, false)"
    @drop="emitFiles($event)"
  >
    <div v-show="showDropUploadBoard" class="v-file-grid__uploader-board">
      <slot name="board"></slot>
    </div>

    <div
      class="v-file-grid__uploader-content"
      :class="{ hide: showDropUploadBoard }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-file-grid__uploader {
  position: relative;

  input[type='file'] {
    display: none;
  }

  &-board {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
  }

  &-content {
    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
