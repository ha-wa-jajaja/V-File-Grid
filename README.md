<p align="center">
    <a href="https://vcalendar.io/" target="_blank">
      <img width="200" src="https://i.imgur.com/NzMBpZ2.pngv-calendar/hero.png">
    </a>
    <br>
    A Google-Drive-Behavior inspired file grid component for Vue 3, constructed with Vue 3 composition API & Typescript.
</p>

<p align="center">
    <img src="https://img.shields.io/npm/dt/v-file-grid.svg" alt="Total Downloads">
    <img src="https://img.shields.io/npm/v/v-file-grid.svg" alt="Latest Release">
    <!-- <img src="https://img.shields.io/npm/v/v-file-grid.svg" alt="Next Release"> -->
    <img src="https://img.shields.io/npm/l/v-file-grid.svg" alt="License">
</p>

---

```bash
npm i v-file-grid
```

## Features

- 📂 Google Drive-like file grid interface
- 🖱️ Multi-select functionality
- 👻 Ghost-select capabilities
- 🔍 Drag and drop file upload hints
- 📜 Auto-scrolling during drag operations

## Demo

- **TODO**

## Components

### `VFileGridFileUploader`

<p>Component that provides flexible and interactive file upload experience with drag-and-drop functionality. This component is able to work on its own.</p>

<br/>

**Props**
| Prop Name | Type | Description | Default |
|-----------|------|-------------|---------|
| `disableUpload` | `boolean` | Disables file upload functionality when set to `true` | `undefined` |

**Event**
| Event Name | Payload | Description |
|------------|---------|-------------|
| `droppedFiles` | `{ files: FileSystemFileEntry[], folders: FileSystemDirectoryEntry[] }` | Emitted when files or folders are dropped onto the component |

**Slots**

| Slot Name | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| `board`   | Content to display when files are being dragged over the component         |
| `content` | Main content of the component, which becomes hidden during drag operations |
