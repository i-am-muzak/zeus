<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from "vue";
import _ from "lodash";

/* Interfaces, types etc. */
import { type KonvaStage, type ConfigKonva } from "./Editor";

import { type BackgroundKonvaStageProps } from "./BackgroundKonvaStage";

const konvaStage: Ref<KonvaStage | null> = ref(null);
const backgroundImage = ref(new Image());
const imageConfig: Ref<any> = ref(null);
const props = defineProps<BackgroundKonvaStageProps>();

const lineOffset = ref(10);

const configKonva = computed<ConfigKonva>(() => {
  return {
    width: backgroundImage.value.width,
    height: backgroundImage.value.height,
    draggable: false,
  };
});

const computedLineCoordinates = computed(() => {
  var coords = [];
  if (backgroundImage.value) {
    var xBorder = null;
    const maxHeight = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));

    for (let i = 0; i < window.innerWidth * 1.5; i += lineOffset.value) {
      var height = Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2));
      var renderedHeight = height > maxHeight ? maxHeight : height

      coords.push({
        x: i,
        y: 0,
        height: -renderedHeight,
      });
    }
  }

  return coords;
});

watch(
  () => props.base64,
  (newValue) => {
    if (newValue) {
      imageConfig.value = null;
      backgroundImage.value.src = newValue;
      backgroundImage.value.onload = () => {
        imageConfig.value = {
          x: 0,
          y: 0,
          image: backgroundImage.value,
          width: backgroundImage.value.width,
          height: backgroundImage.value.height,
        };
      };
    }
  }
);

onMounted(() => {});
</script>

<template>
  <div id="__zeus_editor_background_canvas">
    <div class="editor-container">
      <v-stage ref="konvaStage" :config="configKonva" v-if="imageConfig">
        <v-layer>
          <v-image ref="konvaGroup" :config="imageConfig"></v-image>

          <v-group>
            <v-rect :config="{
              x: 0,
                y: 0,
                width: 1920,
                height: 1080,
                fill: 'rgba(255, 96, 198, .2)'
            }"></v-rect>
            <v-rect
              v-for="coordinate in computedLineCoordinates"
              :config="{
                x: coordinate.x,
                y: coordinate.y,
                fill: '#FF60C6',
                width: 2,
                height: -coordinate.height,
                rotation: 45,
              }"
            >
            </v-rect>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<style lang="less" scoped>
.editor-container {
  background-color: black;
}

#__zeus_editor_background_canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
