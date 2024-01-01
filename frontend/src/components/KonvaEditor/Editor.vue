<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from "vue";
import BackgroundKonvaStage from "./BackgroundKonvaStage.vue";
import _ from "lodash";

/* Interfaces, types etc. */
import {
  type ConfigKonva,
  type KonvaGroup,
  type KonvaStage,
  type konvaBaseImage,
  type KonvaWheelEvent,
  type KonvaDragEvent,
  type Props,
} from "./Editor";
import type { KonvaPointerEvent } from "konva/lib/PointerEvents";

import CircleDashedSvg from "@/assets/images/cursors/circle-dashed.svg";

const konvaStage: Ref<KonvaStage | null> = ref(null);
const konvaBaseImage: Ref<konvaBaseImage | null> = ref(null);
const baseGroup: Ref<KonvaGroup | null> = ref(null);

const image = ref(new Image());
const imageConfig: Ref<any> = ref(null);

const stageWidth: Ref<number> = ref(0);
const stageHeight: Ref<number> = ref(0);

// Scale - Zooming
const scaleBy = ref(1.2);
const currentScale = ref(1);
const stageBackgroundImage: Ref<string | null> = ref(null);
const currentStagePosition = ref({ x: 0, y: 0 });

// Draw Masks
const maskData: Ref<any> = ref([]);
const currentLineMask: Ref<any> = ref(null);
const isDrawingMask = ref(false);
const tempMaskingObject = ref({
  maskData: [],
  currentLineMask: null,
});

// Cursor
const showCursor = ref(true)

const configKonva = computed<ConfigKonva>((): ConfigKonva => {
  return {
    width: stageWidth.value,
    height: stageHeight.value,
    draggable: false,
    name: "baseStage",
  };
});

async function handleStageOnZoom(event: KonvaWheelEvent) {
  event.evt.preventDefault();
  if (konvaStage.value) {
    var oldScale = konvaStage.value.getNode().scaleX();
    var pointer = konvaStage.value.getNode().getPointerPosition();

    if (pointer) {
      var mousePointTo = {
        x: (pointer.x - konvaStage.value.getNode().x()) / oldScale,
        y: (pointer.y - konvaStage.value.getNode().y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = event.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (event.evt.ctrlKey) {
        direction = -direction;
      }

      var newScale =
        direction > 0 ? oldScale * scaleBy.value : oldScale / scaleBy.value;

      if (newScale >= 2 && direction > 0) {
        return;
      } else if (newScale <= 0.5 && direction < 0) {
        return;
      }

      konvaStage.value.getNode().scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      konvaStage.value.getNode().position(newPos);

      currentStagePosition.value = konvaStage.value.getNode().position();
      currentScale.value = newScale;

      copyMasks();
      await resetMasks();
    }
  }
}

function resetMasks() {
  return new Promise((resolve, reject) => {
    currentLineMask.value = null;
    maskData.value = [];
    resolve(true);
  });
}

function copyMasks() {
  if (currentLineMask.value && maskData.value.length) {
    tempMaskingObject.value = {
      currentLineMask: _.cloneDeep(currentLineMask.value),
      maskData: _.cloneDeep(maskData.value),
    };
  }
}

async function stageToJpeg(): Promise<string | null> {
  if (konvaStage.value) {
    const data = konvaStage.value
      .getNode()
      .toDataURL({ mimeType: "image/jpeg" });

    currentLineMask.value = tempMaskingObject.value.currentLineMask;
    maskData.value = tempMaskingObject.value.maskData;

    return data;
  }
  return null;
}

watch(
  currentScale,
  _.debounce(async () => {
    const base64 = await stageToJpeg();

    if (base64) {
      stageBackgroundImage.value = base64;
    }
  }, 250)
);

watch(konvaStage, async () => {
  stageBackgroundImage.value = await stageToJpeg();
});

onMounted(() => {
  stageWidth.value = window.innerWidth;
  stageHeight.value = window.innerHeight;

  image.value.src =
    "https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/80bc20a8-cdd4-457b-a7b7-c83d7d7586bf/Stability+AI+Stable+Diffusion+Astronaut+Feeding+Chickens.jpg";
  image.value.crossOrigin = "anonymous";
  image.value.onload = () => {
    imageConfig.value = {
      x: window.innerWidth / 2 - image.value.width / 2,
      y: window.innerHeight / 2 - image.value.height / 2,
      image: image.value,
      width: image.value.width,
      height: image.value.height,
      draggable: false,
      name: "baseImage",
    };
  };
});

// Image Mouse Events
function handleOnImageMouseDown(event: KonvaPointerEvent) {
  event.evt.preventDefault();

  if (event.target.name() === "baseImage") {
    isDrawingMask.value = true;

    if (konvaStage.value) {
      // Clear current line..
      currentLineMask.value = [];
      var pointerPosition = konvaStage.value.getNode().getPointerPosition();
      const scale = konvaStage.value.getNode().scale();
      const stagePosition = konvaStage.value.getNode().position();

      if (pointerPosition && scale) {
        const calculatedX = (pointerPosition.x - stagePosition.x) / scale.x;
        const calculatedY = (pointerPosition.y - stagePosition.y) / scale.y;

        currentLineMask.value = {
          stroke: "#df4b26",
          strokeWidth: 60,
          globalCompositeOperation: "destination-out",
          lineCap: "round",
          lineJoin: "round",
          points: [calculatedX, calculatedY, calculatedX, calculatedY],
        };
      }
    }
  }
}

function handleOnImageMouseUp(event: KonvaPointerEvent) {
  event.evt.preventDefault();
  isDrawingMask.value = false;

  if (currentLineMask.value) {
    maskData.value.push(currentLineMask.value);
  }
}

function handleOnImageMouseMove(event: KonvaPointerEvent) {
  changeCursor(event.evt.clientX, event.evt.clientY);

  if (konvaStage.value) {
    if (isDrawingMask.value) {
      event.evt.preventDefault();
      var pointerPosition = konvaStage.value.getNode().getPointerPosition();
      const scale = konvaStage.value.getNode().scale();
      const stagePosition = konvaStage.value.getNode().position();

      if (pointerPosition && currentLineMask.value && scale) {
        const calculatedX = (pointerPosition.x - stagePosition.x) / scale.x;
        const calculatedY = (pointerPosition.y - stagePosition.y) / scale.y;

        currentLineMask.value.points = [
          ...currentLineMask.value.points,
          calculatedX,
          calculatedY,
        ];
      }
    }
  }
}

const computedBackgroundRectConfig = computed(() => {
  if (konvaStage.value) {
    return {
      x: -currentStagePosition.value.x / currentScale.value,
      y: -currentStagePosition.value.y / currentScale.value,
      width: window.innerWidth / currentScale.value,
      height: window.innerHeight / currentScale.value,
      fill: "black",
    };
  }

  return null;
});

// cursors
const circleDashedCursor: Ref<HTMLDivElement | null> = ref(null);

function changeCursor(x: number, y: number) {
  if (circleDashedCursor.value) {
    circleDashedCursor.value.style.top = `${y}px`;
    circleDashedCursor.value.style.left = `${x}px`;
  }
}

</script>

<template>
  <div id="__zeus_editor_section" v-if="imageConfig">
    <BackgroundKonvaStage :base64="stageBackgroundImage" />
    <div id="__zeus_editor_main_canvas" >
      <div class="editor-container">
        <v-stage
          ref="konvaStage"
          :config="configKonva"
          v-if="imageConfig"
          @wheel="handleStageOnZoom"
          @mouseleave="showCursor = false"
          @mouseenter="showCursor = true"
          
        >
          <v-layer>
            <v-group
              ref="baseGroup"
              :config="{
                draggable: false,
              }"
              @mouseup="handleOnImageMouseUp"
              @mousedown="handleOnImageMouseDown"
              @mousemove="handleOnImageMouseMove"
            >
              <v-rect :config="computedBackgroundRectConfig"> </v-rect>
              <v-image ref="konvaBaseImage" :config="imageConfig"></v-image>

              <v-group
                v-if="maskData.length"
                :config="{ name: 'LineMaskGroup' }"
              >
                <v-line
                  v-for="maskLine in maskData"
                  :config="maskLine"
                ></v-line>
              </v-group>

              <v-group
                v-if="currentLineMask"
                :config="{ name: 'LineMaskGroup' }"
              >
                <v-line :config="currentLineMask"></v-line>
              </v-group>
            </v-group>
          </v-layer>
        </v-stage>
      </div>
    </div>

    <div
      v-if="showCursor"
      id="circleDashedCursor"
      ref="circleDashedCursor"
      :style="{
        backgroundImage: `url('${CircleDashedSvg}')`,
      }"
    ></div>
  </div>
</template>

<style lang="less" scoped>
#__zeus_editor_section {
  position: relative;
  height: 100%;
  width: 100%;

  #__zeus_editor_main_canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  #circleDashedCursor {
    position: absolute;
    z-index: 10;
    left: 400px;
    top: 400px;
    width: 70px;
    height: 70px;
    stroke: white;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
}
</style>
