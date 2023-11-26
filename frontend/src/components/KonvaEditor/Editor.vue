<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, ref, watch, type Ref } from "vue";
import _ from "lodash";

/* Interfaces, types etc. */
import { type ConfigKonva, type KonvaStage, type KonvaGroup, type KonvaWheelEvent, type KonvaDragEvent, type GridCoords } from "./Editor";


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
const anchorSize = ref(8);

const image = ref(new Image());
const imageConfig: Ref<any> = ref(null);

const gridXOffset = ref(60);
const stagePosition: Ref<any> = ref({ x: 0, y: 0 });
const gridCoords: Ref<GridCoords[]> = ref([]);

function handleOnWheelStage(event: KonvaWheelEvent) {
    const evt: WheelEvent = event.evt
    evt.preventDefault()

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
            var newScale = direction > 0 ? oldScale * scaleBy.value : oldScale / scaleBy.value;

            if (newScale >= 2) {
                newScale = 2;
            }

            // If its between +- 0.15 there won't be any roughness.
            else if (newScale >= 0.85 && newScale <= 1.15) {
                newScale = 1;
            }

            else if (newScale <= 0.5) {
                newScale = 0.5;
            }

            konvaGroup.value.getNode().scale({ x: newScale, y: newScale });

            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            konvaStage.value.getNode().position(newPos);

            if(event.target) {
                stagePosition.value = event.target.position()
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
            stroke: "#fff",
            strokeWidth: 2,
        };
    };
});

function handleOnStageDrag(event: KonvaDragEvent) {
    if (event.target && event.target.name() === "konvaStage") {
        stagePosition.value = event.target.position();
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
        // First anchor (Top center)
        anchors.push({
            x:
                imageConfig.value.x +
                imageConfig.value.width / 2 -
                anchorSize.value / 2,
            y: imageConfig.value.y - anchorSize.value / 2,
        });

        // Second anchor (Right center)
        anchors.push({
            x: imageConfig.value.x + imageConfig.value.width - anchorSize.value / 2,
            y:
                imageConfig.value.y +
                imageConfig.value.height / 2 -
                anchorSize.value / 2,
        });

        // Third anchor (Bottom center)
        anchors.push({
            x:
                imageConfig.value.x +
                imageConfig.value.width / 2 -
                anchorSize.value / 2,
            y: imageConfig.value.y + imageConfig.value.height - anchorSize.value / 2,
        });

        // Forth anchor (Left center)
        anchors.push({
            x: imageConfig.value.x - anchorSize.value / 2,
            y:
                imageConfig.value.y +
                imageConfig.value.height / 2 -
                anchorSize.value / 2,
        });

        return anchors;
    }
});
</script>

<template>
    <div>
        <v-stage ref="konvaStage" :config="configKonva" @wheel="handleOnWheelStage" v-if="imageConfig"
            @dragmove="handleOnStageDrag">
            <v-layer>
                <v-group ref="gridGroup">
                    <v-circle v-for="grid in gridCoords" :config="{
                        x: grid.x,
                        y: grid.y,
                        radius: 1,
                        fill: '#545454',
                    }"></v-circle>
                </v-group>
                <v-group ref="konvaGroup" :config="{
                    draggable: true,
                }">
                    <v-image :config="imageConfig"></v-image>
                    <v-rect v-for="anchor in computedAnchors" :config="{
                        width: anchorSize,
                        height: anchorSize,
                        fill: '#fff',
                        x: anchor.x,
                        y: anchor.y,
                    }"></v-rect>
                </v-group>
            </v-layer>
        </v-stage>
    </div>
</template>
