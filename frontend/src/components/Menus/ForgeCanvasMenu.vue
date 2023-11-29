<template>
  <div
    class="leftMenu absolute bg-[#000000] rounded-[5px] border-[#373737] p-2"
  >
    <div class="h-full flex flex-col">
      <div
        class="border-[#373737] flex items-center justify-center p-3 w-full cursor-pointer"
      >
        <img :src="logoSource" width="36" />
        <h1 class="text-[13px] font-semibold uppercase ml-2 text-white">Zeus</h1>
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
              <n-radio-button class="w-full text-center" label="1" :value="1" />
              <n-radio-button class="w-full text-center" label="2" :value="2" />
              <n-radio-button class="w-full text-center" label="3" :value="3" />
              <n-radio-button class="w-full text-center" label="4" :value="4" />
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
            <div
              class="text-white flex flex-col items-center justify-center text-[#666]"
            >
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
              <div class="text-[10px] mt-2">
                There is no variation for selected layer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import logoSource from "@/assets/images/zeus-logo.png";

import {
  NSelect,
  NRadioGroup,
  NRadioButton,
  NSlider,
} from "naive-ui";

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

<style scoped></style>
