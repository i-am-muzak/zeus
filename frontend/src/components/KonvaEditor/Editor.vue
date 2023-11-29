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
} from "./Editor";

/* Variables */
const configKonva: Ref<ConfigKonva> = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
  name: "konvaStage",
});

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

// TODO: Grid imaj üzerinde wheel gerçekleştiğinde render edilmiyor. Fixlenmesi lazım.
// TODO: Eğer sağ tık basılı ise scale değişimini engelle.
function handleOnWheelStage(event: KonvaWheelEvent) {
  const evt: WheelEvent = event.evt;
  evt.preventDefault();

  if (konvaStage.value && konvaGroup.value) {
    var oldScale = konvaGroup.value.getNode().scaleX();
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
        newScale = 2;
      }

      // If its between +- 0.15 there won't be any roughness.
      else if (newScale >= 0.85 && newScale <= 1.15) {
        newScale = 1;
      } else if (newScale <= 0.5) {
        newScale = 0.5;
      }

      konvaGroup.value.getNode().scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      konvaStage.value.getNode().position(newPos);

      if (event.target) {
        stagePosition.value = event.target.position();
      }
    }
  }
}

onMounted(() => {
  image.value.src =
    "https://editor.analyticsvidhya.com/uploads/97951download%20(10).png";
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
</script>

<template>
  <div id="__zeus_editor_section">
    <v-stage
      ref="konvaStage"
      :config="configKonva"
      @wheel="handleOnWheelStage"
      v-if="imageConfig"
      @dragmove="handleOnStageDrag"
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
          ref="konvaGroup"
          :config="{
            draggable: true,
          }"
        >
          <v-image :config="imageConfig"></v-image>
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
</template>
