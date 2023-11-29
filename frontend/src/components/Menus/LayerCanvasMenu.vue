<template>
  <div
    class="layerMenu absolute bg-[#000000] rounded-[5px] border border-[#373737]"
  >
    <div class="border-b border-[#373737] flex items-center text-[#666] p-3">
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
            <img :src="layer.previewImage" width="42" class="rounded-[3px]" />
          </div>
          <div class="text-[#cccccc] text-[10px] font-semibold p-2">
            {{ layer.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
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
</script>

<style scoped></style>
