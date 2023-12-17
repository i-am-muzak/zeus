<template>
    <div>
        <canvas ref="canvasEditor"></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref, type Ref, onMounted, computed} from "vue";
import Canvas, {
    type InfiniteCanvasRenderingContext2D,
    type InfiniteCanvas,
    type TransformationEvent
} from "ef-infinite-canvas";

const infiniteCanvas: Ref<InfiniteCanvas | null> = ref(null);
const canvasEditor: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<InfiniteCanvasRenderingContext2D | null> = ref(null);
const canvasBaseImage: Ref<HTMLImageElement | null> = ref(new Image());

const circleGridOffset = ref(100);

// Scale Data
const currentScale = ref(1);

function drawImage() {
    if (context.value && canvasBaseImage.value) {
        context.value.beginPath()
        context.value.drawImage(
            canvasBaseImage.value,
            (context.value.canvas.width - canvasBaseImage.value.width) / 2,
            (context.value.canvas.height - canvasBaseImage.value.height) / 2,
        );
    }
}

function drawGridCircles() {
    if (context.value) {
        context.value.beginPath()

        for (let x = 0; x < window.innerWidth; x += circleGridOffset.value) {
            for (let y = 0; y < window.innerHeight; y += circleGridOffset.value) {
                context.value.rect(x, y, 20, 20)
            }
        }
        context.value.fillStyle = "#fff"
        context.value.fill()

    }
}

onMounted(() => {
    if (canvasEditor.value) {
        // context.value = canvasEditor.value.getContext("2d");
        canvasEditor.value.width = window.innerWidth;
        canvasEditor.value.height = window.innerHeight;


        setTimeout(() => {
            infiniteCanvas.value = new Canvas(canvasEditor.value);
            if (infiniteCanvas.value) {
                context.value = infiniteCanvas.value.getContext("2d");

                // Set Image properties.
                if (canvasBaseImage.value) {
                    canvasBaseImage.value.src = "https://i.hizliresim.com/7hyg5rc.jpg";
                    canvasBaseImage.value.onload = () => {
                        drawGridCircles()
                    };
                }
            }

            // Infinite Canvas Event Handlers
            infiniteCanvas.value.ondraw = (event: TransformationEvent) => {
                currentScale.value = 1 / event.transformation.a;
            }

            infiniteCanvas.value.onwheel = (event) => {
                if (currentScale.value >= 0.5 && currentScale.value <= 2) {
                    event.preventDefault()
                }
            }

        }, 1000);
    }
});
</script>
