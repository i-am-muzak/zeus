<script setup lang="ts">
import { ref, Ref } from "vue";
import KonvaEditor from "@/components/KonvaEditor/Editor.vue";

import {
  NIcon,
  NSelect,
  NConfigProvider,
  darkTheme,
  NRadioGroup,
  NRadioButton,
  NSlider,
} from "naive-ui";

const layers = ref([
  {
    isVisible: true,
    previewImage:
      "https://cdn.pixabay.com/photo/2016/11/19/01/47/sky-1837666_1280.jpg",
    title: "Layer 1",
  },
  {
    isVisible: true,
    previewImage:
      "https://cdn.pixabay.com/photo/2016/11/19/01/47/sky-1837666_1280.jpg",
    title: "Layer 2",
  },
  {
    isVisible: true,
    previewImage:
      "https://cdn.pixabay.com/photo/2016/11/19/01/47/sky-1837666_1280.jpg",
    title: "Layer 3",
  },
  {
    isVisible: true,
    previewImage:
      "https://cdn.pixabay.com/photo/2016/11/19/01/47/sky-1837666_1280.jpg",
    title: "Layer 4",
  },
  {
    isVisible: true,
    previewImage:
      "https://cdn.pixabay.com/photo/2016/11/19/01/47/sky-1837666_1280.jpg",
    title: "Layer 5",
  },
]);

const selectedLayer = ref(0);
const selectedModel = ref("song1");
const models = ref([
  {
    label: "Everybody's Got Something to Hide Except Me and My Monkey",
    value: "song0",
    disabled: true,
  },
  {
    label: "Drive My Car",
    value: "song1",
  },
  {
    label: "Norwegian Wood",
    value: "song2",
  },
  {
    label: "You Won't See",
    value: "song3",
    disabled: true,
  },
  {
    label: "Nowhere Man",
    value: "song4",
  },
]);
const numberOfImages = ref(4);

const strengthValue = ref(8);
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div>
      <div>
        <div
          class="topMenu absolute bg-[#000000] p-1 rounded-[5px] flex items-center justify-center border border-[#373737]"
        >
          <div
            class="p-2.5 flex text-[#4d4d4d] items-center justify-center hover:bg-[#f6d658] rounded-[5px] cursor-pointer transition duration-200 hover:text-[#000000] mr-[2px]"
          >
            <n-icon size="20">
              <svg
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
              </svg>
            </n-icon>
          </div>
          <div
            class="p-2.5 flex text-[#4d4d4d] items-center justify-center hover:bg-[#f6d658] rounded-[5px] cursor-pointer transition duration-200 hover:text-[#000000] mr-[2px]"
          >
            <n-icon size="20">
              <svg
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
              </svg>
            </n-icon>
          </div>
          <div
            class="p-2.5 flex text-[#4d4d4d] items-center justify-center hover:bg-[#f6d658] rounded-[5px] cursor-pointer transition duration-200 hover:text-[#000000] mr-[2px]"
          >
            <n-icon size="20">
              <svg
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
                <path
                  d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                />
                <path d="M13.5 6.5l4 4" />
                <path d="M16 19h6" />
              </svg>
            </n-icon>
          </div>
          <div
            class="p-2.5 flex text-[#4d4d4d] items-center justify-center hover:bg-[#f6d658] rounded-[5px] cursor-pointer transition duration-200 hover:text-[#000000] mr-[2px]"
          >
            <n-icon size="20">
              <svg
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
              </svg>
            </n-icon>
          </div>
          <div
            class="p-2.5 flex text-[#4d4d4d] items-center justify-center hover:bg-[#f6d658] rounded-[5px] cursor-pointer transition duration-200 hover:text-[#000000] mr-[2px]"
          >
            <n-icon size="20">
              <svg
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
                <path
                  d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                />
                <path d="M13.5 6.5l4 4" />
              </svg>
            </n-icon>
          </div>
        </div>
        <div
          class="layerMenu absolute bg-[#000000] rounded-[5px] border border-[#373737]"
        >
          <div
            class="border-b border-[#373737] flex items-center text-[#666] p-3"
          >
            <span class="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-squares-filled"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke-width="1.25"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                />
                <path d="M8 14.5l6.492 -6.492" />
                <path d="M13.496 20l6.504 -6.504l-6.504 6.504z" />
                <path d="M8.586 19.414l10.827 -10.827" />
                <path
                  d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                />
              </svg>
            </span>
            <h1 class="text-[10px] font-semibold uppercase">Layers</h1>
          </div>

          <div>
            <div v-for="(layer, index) in layers">
              <div
                class="flex items-center p-1 hover:bg-[#1f1f1f] cursor-pointer"
                :class="{
                  'bg-[#1f1f1f]': index === selectedLayer,
                }"
              >
                <div class="text-[#ccc] px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-eye"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    stroke-width="1.25"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path
                      d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                    />
                  </svg>
                </div>
                <div>
                  <img
                    :src="layer.previewImage"
                    width="42"
                    class="rounded-[3px]"
                  />
                </div>
                <div class="text-[#cccccc] text-[10px] font-semibold p-2">
                  {{ layer.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="leftMenu absolute bg-[#000000] rounded-[5px] border-[#373737] p-2"
        >
          <div class="h-full flex flex-col">
            <div
              class="border-[#373737] flex items-center text-[#f6d658] p-3 w-full justify-center"
            >
              <span class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-bolt"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  stroke-width="1.25"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
                </svg>
              </span>
              <h1 class="text-[13px] font-semibold uppercase">Zeus</h1>
            </div>

            <div class="h-full flex flex-col">
              <div>
                <div
                  class="flex items-center justify-between text-[#666] p-3 text-[10px]"
                >
                  <h1 class="font-semibold uppercase">Finetuned Model</h1>
                  <div class="flex items-center">
                    <span class="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-aspect-ratio"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        stroke-width="1.25"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"
                        />
                        <path d="M7 12v-3h3" />
                        <path d="M17 12v3h-3" />
                      </svg>
                    </span>
                    <span> 768x768 </span>
                  </div>
                </div>

                <div>
                  <n-select v-model:value="selectedModel" :options="models" />
                </div>
              </div>
              <div class="mt-3">
                <div class="flex items-center text-[#666] p-3 text-[10px]">
                  <h1 class="font-semibold uppercase">Number of Images</h1>
                  <span class="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-info-square-rounded"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      stroke-width="1.25"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 9h.01" />
                      <path d="M11 12h1v4h1" />
                      <path
                        d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"
                      />
                    </svg>
                  </span>
                </div>

                <div class="w-full">
                  <n-radio-group
                    v-model:value="numberOfImages"
                    class="w-full flex items-center"
                  >
                    <n-radio-button
                      class="w-full text-center"
                      label="1"
                      :value="1"
                    />
                    <n-radio-button
                      class="w-full text-center"
                      label="2"
                      :value="2"
                    />
                    <n-radio-button
                      class="w-full text-center"
                      label="3"
                      :value="3"
                    />
                    <n-radio-button
                      class="w-full text-center"
                      label="4"
                      :value="4"
                    />
                  </n-radio-group>
                </div>
              </div>

              <div class="mt-3">
                <div class="flex items-center text-[#666] p-3 text-[10px]">
                  <h1 class="font-semibold uppercase">Strength</h1>
                  <span class="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-info-square-rounded"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      stroke-width="1.25"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 9h.01" />
                      <path d="M11 12h1v4h1" />
                      <path
                        d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"
                      />
                    </svg>
                  </span>
                </div>

                <div class="w-full flex items-center">
                  <div class="w-full">
                    <n-slider
                      :tooltip="false"
                      v-model:value="strengthValue"
                      :min="1"
                      :max="20"
                      :step="1"
                    />
                  </div>
                  <span class="text-white w-[60px] text-center text-[10px]">
                    {{ strengthValue * 5 }} %
                  </span>
                </div>
              </div>

              <div class="mt-3 flex flex-col h-full">
                <div class="flex items-center text-[#666] p-3 text-[10px]">
                  <h1 class="font-semibold uppercase">Variation History</h1>
                  <span class="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-history"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      stroke-width="1.25"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 8l0 4l2 2" />
                      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                    </svg>
                  </span>
                </div>

                <div
                  class="h-full border rounded-[3px] border-[#333] flex items-center justify-center border-dashed"
                >
                  <div class="text-white flex flex-col items-center justify-center text-[#666]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-mood-smile-beam"
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
                      <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z" />
                      <path d="M10 10c-.5 -1 -2.5 -1 -3 0" />
                      <path d="M17 10c-.5 -1 -2.5 -1 -3 0" />
                      <path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
                    </svg>
                    <div class="text-[10px] mt-2">There is no variation for selected layer.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <KonvaEditor />
    </div>
  </n-config-provider>
</template>

<style scoped lang="less">
.topMenu {
  z-index: 10;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
}

.layerMenu {
  z-index: 10;
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  min-width: 235px;
}

.leftMenu {
  z-index: 10;
  left: 0;
  top: 0;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  width: 270px;
  height: 100%;
  max-height: 100%;
}
</style>
