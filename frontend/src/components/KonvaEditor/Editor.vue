<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, ref, watch, type Ref } from "vue";
import _ from "lodash";

/* Interfaces, types etc. */
import {
  type ConfigKonva,
  type KonvaStage,
  type KonvaGroup,
  type KonvaWheelEvent,
  type KonvaDragEvent,
  type GridCoords,
  type Props,
} from "./Editor";

import { NPopover, NButton, NInput } from "naive-ui";

/* Variables */
// const configKonva: Ref<ConfigKonva> = ref({
//   width: window.innerWidth,
//   height: window.innerHeight,
//   draggable: true,
//   name: "konvaStage",
// });

const konvaStage: Ref<KonvaStage | null> = ref(null);
const konvaGroup: Ref<KonvaGroup | null> = ref(null);
const scaleBy = ref(1.25);
const anchorWidth = ref(10);
const anchorHeight = ref(10);
const anchorOffset = ref(2);
const leftCenterAnchorOpacity = ref(0);
const topCenterAnchorOpacity = ref(0);
const rightCenterAnchorOpacity = ref(0);
const bottomCenterAnchorOpacity = ref(0);

const image = ref(new Image());
const imageConfig: Ref<any> = ref(null);
const imageStrokeWidth = ref(8);

const gridXOffset = ref(60);
const stagePosition: Ref<any> = ref({ x: 0, y: 0 });
const gridCoords: Ref<GridCoords[]> = ref([]);

const props = defineProps<Props>();

// Popper
const showPopover = ref(false);
const popOverX = ref(undefined);
const popOverY = ref(undefined);

// Drawing Mask
const isDrawingMask: Ref<Boolean> = ref(false);
const maskGroup = ref(null);
const masks: Ref<any> = ref([]);

// Brush General
const brushSize: Ref<number> = ref(35);

const scaleValue: Ref<number> = ref(1);

const lastImagePos: Ref<any> = ref({
  x: 0,
  y: 0,
});

const getMasks = computed(() => {
  return masks.value;
});

// TODO: Grid imaj üzerinde wheel gerçekleştiğinde render edilmiyor. Fixlenmesi lazım.
// TODO: Eğer sağ tık basılı ise scale değişimini engelle.
function handleOnWheelStage(event: KonvaWheelEvent) {
  const evt: WheelEvent = event.evt;
  evt.preventDefault();

  if (konvaStage.value && konvaGroup.value) {
    var oldScale = konvaStage.value.getNode().scaleX();

    var pointer = konvaStage.value.getNode().getPointerPosition();

    if (pointer) {
      var mousePointTo = {
        x: (pointer.x - konvaStage.value.getNode().x()) / oldScale,
        y: (pointer.y - konvaStage.value.getNode().y()) / oldScale,
      };

      // Check direction of scale (Zoom in or Zoom out...)
      let direction = event.evt.deltaY > 0 ? 1 : -1;

      /**
             Calculate the amount of scale on stage.
             Amount of scale will be calculated by multiplying scaleBy's value that we've defined on the variables section.
            */
      var newScale =
        direction > 0 ? oldScale * scaleBy.value : oldScale / scaleBy.value;

      if (newScale >= 2) {
        newScale = scaleValue.value;
      }

      // If its between +- 0.15 there won't be any roughness.
      else if (newScale >= 0.85 && newScale <= 1.15) {
        newScale = 1;
      } else if (newScale <= 0.5) {
        newScale = scaleValue.value;
      }

      konvaStage.value.getNode().scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      konvaStage.value.getNode().position(newPos);

      scaleValue.value = newScale;
      if (event.target) {
        stagePosition.value = newPos;
      }
    }
  }
}

function updateMasks(scale: number) {
  console.log(scale);
}

onMounted(() => {
  image.value.src = "https://i.hizliresim.com/kap164v.jpg";
  image.value.onload = () => {
    imageConfig.value = {
      x: window.innerWidth / 2 - image.value.width / 2,
      y: window.innerHeight / 2 - image.value.height / 2,
      image: image.value,
      width: image.value.width,
      height: image.value.height,
      // stroke: "#039BE5",
      stroke: "rgba(0, 130, 255, .4)",
      strokeWidth: imageStrokeWidth.value,
    };
  };
});

function handleOnStageDrag(event: KonvaDragEvent) {
  if (event.target && event.target.name() === "konvaStage") {
    stagePosition.value = event.target.position();
  }
}

function updateAnchorOpacity(
  anchorName: string,
  value: number,
  onStage: boolean
) {
  const zeusEditorSection = document.getElementById("__zeus_editor_section");

  if (!onStage) {
    if (zeusEditorSection && zeusEditorSection.style.cursor !== "default") {
      zeusEditorSection.style.cursor = "default";
    }
  }

  switch (anchorName) {
    case "top-center":
      if (onStage) {
        if (
          zeusEditorSection &&
          zeusEditorSection.style.cursor !== "n-resize"
        ) {
          zeusEditorSection.style.cursor = "n-resize";
        }
      }
      topCenterAnchorOpacity.value = value;
      break;

    case "bottom-center":
      if (onStage) {
        if (
          zeusEditorSection &&
          zeusEditorSection.style.cursor !== "s-resize"
        ) {
          zeusEditorSection.style.cursor = "s-resize";
        }
      }
      bottomCenterAnchorOpacity.value = value;
      break;

    case "left-center":
      if (onStage) {
        if (
          zeusEditorSection &&
          zeusEditorSection.style.cursor !== "w-resize"
        ) {
          zeusEditorSection.style.cursor = "w-resize";
        }
      }
      leftCenterAnchorOpacity.value = value;
      break;

    case "right-center":
      if (onStage) {
        if (
          zeusEditorSection &&
          zeusEditorSection.style.cursor !== "e-resize"
        ) {
          zeusEditorSection.style.cursor = "e-resize";
        }
      }
      rightCenterAnchorOpacity.value = value;
      break;

    default:
      break;
  }
}
/**
 * Draw grid dots when stagePosition changes on mousemove event.
 * Debounce used for performance.
 */
watch(
  stagePosition,
  _.debounce(() => {
    gridCoords.value = [];

    // Start position of dots on the axis X.
    const startX =
      Math.floor(
        (-stagePosition.value.x - window.innerWidth / gridXOffset.value) /
          gridXOffset.value
      ) * gridXOffset.value;

    const endX = Math.floor(
      -stagePosition.value.x + window.innerWidth + gridXOffset.value * 5
    );

    // Start position of dots on the axis Y.
    const startY =
      Math.floor(
        (-stagePosition.value.y - window.innerHeight / 2) / gridXOffset.value
      ) * gridXOffset.value;
    const endY = Math.floor(
      -stagePosition.value.y + window.innerHeight + gridXOffset.value * 5
    );

    // Push coords to the gridCoords variable so it'll be re-rendered on the template tab.
    for (var x = startX; x < endX; x += gridXOffset.value) {
      for (var y = startY; y < endY; y += gridXOffset.value) {
        gridCoords.value.push({
          x,
          y,
        });
      }
    }
  }, 20),
  {
    immediate: true,
  }
);

watch(scaleValue, (newValue, oldValue) => {
  console.log("**********************");

  console.log(`New: ${newValue} - Old: ${oldValue}`);

  // It means the user is zooming in so we need to multiply mask width with the scale value.
  if (newValue >= oldValue) {
    if (newValue <= 1) {
      // We need to revert the previous width if its zoomed out already. (Smaller than 1)
      updateMasks(1 / oldValue);
    } else {
      updateMasks(newValue);
    }
  } else {
    if (newValue < 1) {
      updateMasks(newValue);
    } else {
      // We need to revert the previous width if its zoomed in already.
      updateMasks(1 / oldValue);
    }
  }
});

const computedAnchors = computed(() => {
  var anchors = [];

  if (imageConfig.value) {
    // First anchor (Left center)
    anchors.push({
      x:
        imageConfig.value.x -
        (imageStrokeWidth.value / 2 + anchorWidth.value + anchorOffset.value),
      y: imageConfig.value.y - anchorOffset.value * 2,
      width: anchorWidth.value,
      height: image.value.height + imageStrokeWidth.value,
      name: "left-center",
      fill: `rgba(255, 255, 255, ${leftCenterAnchorOpacity.value / 100})`,
      cornerRadius: [5, 0, 0, 5],
    });

    // Second anchor (Right center)
    anchors.push({
      x: imageConfig.value.x + imageConfig.value.width + anchorOffset.value,
      y: imageConfig.value.y - anchorOffset.value * 2,
      width: anchorWidth.value,
      height: image.value.height + imageStrokeWidth.value,
      name: "right-center",
      fill: `rgba(255, 255, 255, ${rightCenterAnchorOpacity.value / 100})`,
      cornerRadius: [0, 5, 5, 0],
    });

    // Third anchor (Top center)
    anchors.push({
      x: imageConfig.value.x - anchorOffset.value * 3,
      y: imageConfig.value.y - (imageStrokeWidth.value / 2 + anchorWidth.value),
      width: image.value.width + imageStrokeWidth.value,
      height: anchorHeight.value,
      name: "top-center",
      fill: `rgba(255, 255, 255, ${topCenterAnchorOpacity.value / 100})`,
      cornerRadius: [5, 5, 0, 0],
    });

    // Forth anchor (Bottom center)
    anchors.push({
      x: imageConfig.value.x - anchorOffset.value * 3,
      y: imageConfig.value.y + image.value.width + anchorOffset.value * 2,
      width: image.value.width + imageStrokeWidth.value,
      height: anchorHeight.value,
      name: "bottom-center",
      fill: `rgba(255, 255, 255, ${bottomCenterAnchorOpacity.value / 100})`,
      cornerRadius: [0, 0, 5, 5],
    });

    return anchors;
  }
});

const configKonva = computed(() => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: props.tool === "free-pan" ? true : false,
    name: "konvaStage",
  };
});

const maskStageConfig = computed(() => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    name: "konvaMaskStage",
  };
});

const prompt = ref("");

function test(event: KonvaDragEvent) {
  const positions = konvaStage.value?.getNode().getPointerPosition();
  if (positions) {
    popOverX.value = positions.x;
    popOverY.value = positions.y;
    showPopover.value = true;
  }
}

function imageMouseUp(event: KonvaDragEvent) {
  event.evt.preventDefault();

  switch (props.tool) {
    case "draw-mask":
      isDrawingMask.value = false;
      break;

    default:
      break;
  }
}

function imageMouseDown(event: KonvaDragEvent) {
  event.evt.preventDefault();

  switch (props.tool) {
    case "draw-mask":
      isDrawingMask.value = true;

      if (konvaStage.value && konvaGroup.value) {
        const scaledX =
          (event.evt.clientX - lastImagePos.value.x - stagePosition.value.x) /
          scaleValue.value;

        const scaledY =
          (event.evt.clientY - lastImagePos.value.y - stagePosition.value.y) /
          scaleValue.value;

        masks.value.push({
          // add point twice, so we have some drawings even on a simple click
          stroke: "rgba(255, 255, 255, 1)",
          strokeWidth: brushSize.value,
          globalCompositeOperation: "destination-out",
          // round cap for smoother lines
          lineCap: "round",
          lineJoin: "round",
          points: [scaledX, scaledY, scaledX, scaledY],
        });
      }
      break;

    default:
      break;
  }
}

function imageMouseMove(event: KonvaDragEvent) {
  switch (props.tool) {
    case "draw-mask":
      if (maskGroup.value) {
        const masksLength = masks.value.length;
        if (masksLength && isDrawingMask.value) {
          masks.value[masksLength - 1].points = [
            ...masks.value[masksLength - 1].points,
            (event.evt.clientX - lastImagePos.value.x - stagePosition.value.x) /
              scaleValue.value,
            (event.evt.clientY - lastImagePos.value.y - stagePosition.value.y) /
              scaleValue.value,
          ];
        }
      }

      break;

    default:
      break;
  }
}

function imageDragEnd(event) {
  const x = event.target._lastPos.x - stagePosition.value.x;
  const y = event.target._lastPos.y - stagePosition.value.y;

  lastImagePos.value.x = x;
  lastImagePos.value.y = y;
}

const computedMaskCoords = computed(() => {
  var coords = [];
  if (imageConfig.value) {
    for (
      let x = imageConfig.value.x;
      x < imageConfig.value.x + imageConfig.value.width;
      x += 5
    ) {
      for (
        let y = imageConfig.value.y;
        y < imageConfig.value.y + imageConfig.value.height;
        y += 5
      ) {
        coords.push({
          x,
          y,
        });
      }
    }
  }
  return coords;
});
</script>

<template>
  <div id="__zeus_editor_section">
    <div id="__zeus_editor_mask_backround" v-if="imageConfig">
      <v-stage :config="maskStageConfig">
        <v-layer>
          <v-group>
            <v-image :config="imageConfig"></v-image>
          </v-group>
          <v-group>
            <v-circle
              v-for="coord in computedMaskCoords"
              :config="{
                x: coord.x,
                y: coord.y,
                radius: 1,
                fill: '#1677ff',
              }"
            >
            </v-circle>
          </v-group>

          <v-rect
            :config="{
              x: imageConfig.x,
              y: imageConfig.y,
              width: imageConfig.width,
              height: imageConfig.height,
              fill: 'rgba(0, 0, 255, 0.2)',
            }"
          >
          </v-rect>
        </v-layer>
      </v-stage>
    </div>
    <div id="__zeus_editor_main_canvas">
      <v-stage
        ref="konvaStage"
        :config="configKonva"
        v-if="imageConfig"
        @dragmove="handleOnStageDrag"
        @wheel="handleOnWheelStage"
        @click="test"
      >
        <v-layer>
          <v-group ref="gridGroup">
            <v-circle
              v-for="grid in gridCoords"
              :config="{
                x: grid.x,
                y: grid.y,
                radius: 1,
                fill: '#545454',
              }"
            ></v-circle>
          </v-group>

          <v-group
            :config="{
              draggable: props.tool === 'free-pan' ? true : false,
            }"
            @mousedown="imageMouseDown"
            @mouseup="imageMouseUp"
            @mousemove="imageMouseMove"
            @dragend="imageDragEnd"
          >
            <v-image ref="konvaGroup" :config="imageConfig"></v-image>

            <v-group ref="maskGroup"
              ><v-line
                v-for="(lineMask, index) in getMasks"
                :key="index"
                :config="lineMask"
              >
              </v-line>
            </v-group>

            <v-rect
              v-for="(anchor, index) in computedAnchors"
              :key="index"
              @mouseover="updateAnchorOpacity(anchor.name, 7, true)"
              @mouseleave="updateAnchorOpacity(anchor.name, 0, false)"
              :config="{
                fill: anchor.fill,
                x: anchor.x + 2,
                y: anchor.y,
                width: anchor.width,
                height: anchor.height,
                name: anchor.name,
                cornerRadius: anchor.cornerRadius,
              }"
            ></v-rect>
          </v-group>
        </v-layer>
      </v-stage>
    </div>

    <!-- <n-popover
      :show="showPopover"
      trigger="manual"
      :x="popOverX"
      :y="popOverY"
      placement="bottom"
      :style="{ marginTop: '50px' }"
    >
      <template #trigger>
        <div></div>
      </template>
      <template #default>
        <div class="">
          <div class="flex items-center">
            <div class="flex items-center">
              <n-button quaternary type="primary" size="small">
                <template #icon>
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-arrow-narrow-left"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l14 0" />
                      <path d="M5 12l4 4" />
                      <path d="M5 12l4 -4" />
                    </svg>
                  </n-icon>
                </template>
              </n-button>
              <span class="mx-1.5 text-[12px]">1/4</span>
              <n-button quaternary type="primary" size="small">
                <template #icon>
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-arrow-narrow-right"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l14 0" />
                      <path d="M15 16l4 -4" />
                      <path d="M15 8l4 4" />
                    </svg>
                  </n-icon>
                </template>
              </n-button>
            </div>
            <div class="ml-2 w-[240px]">
              <n-input
                class="text-[10px]"
                v-model:value="prompt"
                type="text"
                placeholder="Your prompt..."
              />
            </div>
            <div class="ml-2">
              <n-button class="text-[10px]" strong secondary type="primary">
                Cancel
              </n-button>
              <n-button class="text-[10px]" strong secondary type="primary">
                Accept
              </n-button>
            </div>
          </div>
        </div>
      </template>
    </n-popover> -->
  </div>
</template>

<style lang="less">
#__zeus_editor_section {
  position: relative;
  z-index: 1;
  #__zeus_editor_mask_backround {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }

  #__zeus_editor_main_canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
  }
}
</style>
