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

[StackBlitz](https://stackblitz.com/edit/vitejs-vite-suohd4ox?file=src%2FApp.vue)

## Components

### `VFileGridFileUploader`

<p>Component that provides flexible and interactive file upload experience with drag-and-drop functionality. This component is able to work on its own.</p>

#### Props

| Prop Name       | Type      | Description                                           | Default     |
| --------------- | --------- | ----------------------------------------------------- | ----------- |
| `disableUpload` | `boolean` | Disables file upload functionality when set to `true` | `undefined` |

#### Event

| Event Name     | Payload                                                                 | Description                                                  |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `droppedFiles` | `{ files: FileSystemFileEntry[], folders: FileSystemDirectoryEntry[] }` | Emitted when files or folders are dropped onto the component |

#### Slots

| Slot Name | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| `board`   | Content to display when files are being dragged over the component         |
| `content` | Main content of the component, which becomes hidden during drag operations |

<br/>

---

### `VFileGridContainer`

<p>component that provides a flexible grid-based container with multi-select and ghost selection functionality for file or item management.</p>

#### Model

| Model Name | Type          | Description              |
| ---------- | ------------- | ------------------------ |
| `v-model`  | `Set<string>` | Tracks selected item IDs |

#### Props

<table>
  <thead>
    <tr>
      <th>Prop Name</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>allIds</code></td>
      <td><code>Array&lt;string | number&gt;</code></td>
      <td>Yes</td>
      <td>List of all item IDs</td>
      <td>-</td>
    </tr>
    <tr>
      <td><code>itemClassName</code></td>
      <td><code>string</code></td>
      <td>Yes</td>
      <td>CSS class for individual items</td>
      <td>-</td>
    </tr>
    <tr>
      <td><code>ghostSelectorBg</code></td>
      <td><code>string</code></td>
      <td>Yes</td>
      <td>Background color for ghost selector</td>
      <td>-</td>
    </tr>
    <tr>
      <td><code>containerClassName</code></td>
      <td><code>string</code></td>
      <td>No</td>
      <td>Additional CSS class for container</td>
      <td><code>undefined</code></td>
    </tr>
    <tr>
      <td><code>scroller</code></td>
      <td><code>VFgAutoScrollEl</code></td>
      <td>No</td>
      <td>Scrolling element</td>
      <td><code>'window'</code></td>
    </tr>
    <tr>
      <td><code>scrollerConfig</code></td>
      <td><code>VFgAutoScrollConfig</code></td>
      <td>No</td>
      <td>
        <strong>Scroll behavior configuration:</strong>
        <table>
          <tr>
            <td><code>scrollSpeed</code></td>
            <td>will be how many px each <code>requestAnimationFrame</code> when auto-scrolling</td>
          </tr>
          <tr>
            <td><code>scrollThreshold</code></td>
            <td>is the height of the auto scrolling sensing zone relative the height of the assigned scroller</td>
          </tr>
        </table>
      </td>
      <td><code>{ scrollSpeed: 5, scrollThreshold: 0.2 }</code></td>
    </tr>
    <tr>
      <td><code>cols</code></td>
      <td><code>number</code></td>
      <td>No</td>
      <td>Number of grid columns</td>
      <td><code>6</code></td>
    </tr>
    <tr>
      <td><code>gap</code></td>
      <td><code>string | number</code></td>
      <td>No</td>
      <td>Grid gap between items</td>
      <td><code>24</code></td>
    </tr>
    <tr>
      <td><code>padding</code></td>
      <td><code>string</code></td>
      <td>No</td>
      <td>Container padding</td>
      <td><code>'40px'</code></td>
    </tr>
  </tbody>
</table>

#### Slots

| Slot Name         | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `items`           | Grid items to be displayed                                                                   |
| `multiItemsBoard` | Element to replace the original `dragImage` when multiple items are selected and is dragging |

<br/>

---

### `VFileGridItem`

provides interactive item selection, dragging, and click handling within a file grid system.

#### Props

<table>
  <thead>
    <tr>
      <th>Prop Name</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td><code>string</code></td>
      <td>Yes</td>
      <td>Unique identifier for the item</td>
      <td>-</td>
    </tr>
  </tbody>
</table>

#### Emits

<table>
  <thead>
    <tr>
      <th>Event Name</th>
      <th>Payload</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>onItemDragStateChange</code></td>
      <td><code>boolean</code></td>
      <td>Triggered when item drag state changes</td>
    </tr>
  </tbody>
</table>

#### Slot

<table>
  <thead>
    <tr>
      <th>Slot Props</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>isSelected</code>: <code>boolean</code><br><code>id</code>: <code>string</code></td>
      <td>Provides selection state and item ID to slot content</td>
    </tr>
  </tbody>
</table>
