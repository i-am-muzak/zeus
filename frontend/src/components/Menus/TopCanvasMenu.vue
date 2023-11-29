<template>
  <div
    class="topMenu absolute bg-[#000000] p-1 rounded-[5px] flex items-center justify-center border border-[#373737]"
  >
    <div
      class="p-1.5 flex text-[#4d4d4d] items-center justify-center rounded-[5px] cursor-pointer mr-[2px]"
      v-for="tool in tools"
      @click="selectTool(tool.value)"
      :class="{
        'bg-[#212121]': tool.value === selectedTool,
        'text-[#039BE5]': tool.value === selectedTool,
        'hover:text-[#9E9E9E]': tool.value !== selectedTool,
      }"
    >
      <n-icon size="20" v-html="tool.icon"></n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";

const tools = ref([
  {
    title: "Selection Tool",
    description: "qweqweqwe",
    icon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-drag-drop"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.25"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
          />
          <path d="M13 13l9 3l-4 2l-2 4l-3 -9" />
          <path d="M3 3l0 .01" />
          <path d="M7 3l0 .01" />
          <path d="M11 3l0 .01" />
          <path d="M15 3l0 .01" />
          <path d="M3 7l0 .01" />
          <path d="M3 11l0 .01" />
          <path d="M3 15l0 .01" />
        </svg>`,
    value: "selection",
  },
  {
    title: "Free Pan",
    description: "qweqweqwe",
    icon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-hand-grab"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.25"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 11v-3.5a1.5 1.5 0 0 1 3 0v2.5" />
          <path d="M11 9.5v-3a1.5 1.5 0 0 1 3 0v3.5" />
          <path d="M14 7.5a1.5 1.5 0 0 1 3 0v2.5" />
          <path
            d="M17 9.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"
          />
        </svg>`,
    value: "free-pan",
  },
  {
    title: "Paint Brush",
    description: "qweqweqwe",
    icon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-pencil"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.25"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
        </svg>`,
    value: "paint-brush",
  },
  {
    title: "Draw Mask",
    description: "qweqweqwe",
    icon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-pencil-minus"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.25"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
          <path d="M13.5 6.5l4 4" />
          <path d="M16 19h6" />
        </svg>`,
    value: "draw-mask",
  },
  {
    title: "Eraser",
    description: "qweqweqwe",
    icon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-eraser"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.25"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"
          />
          <path d="M18 13.3l-6.3 -6.3" />
        </svg>`,
    value: "eraser",
  },
]);

const selectedTool = ref("selection");

function selectTool(tool: string) {
  selectedTool.value = tool;
}
</script>

<style scoped lang="less">
.topMenu {
  z-index: 10;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
}
</style>
