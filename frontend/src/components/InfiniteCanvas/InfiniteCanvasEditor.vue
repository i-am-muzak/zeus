<template>
  <div>
    <canvas ref="canvasEditor"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from "vue";
import Canvas, {
  type InfiniteCanvasRenderingContext2D,
  type InfiniteCanvas,
  type TransformationEvent,
} from "ef-infinite-canvas";

const infiniteCanvas: Ref<InfiniteCanvas | null> = ref(null);
const canvasEditor: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<InfiniteCanvasRenderingContext2D | null> = ref(null);
const canvasBaseImage: Ref<HTMLImageElement | null> = ref(new Image());

const circleGridOffset = ref(50);

// Scale Data
const currentScale = ref(1);
const minZoom = ref(0.5);
const maxZoom = ref(3);

function drawImage() {
  if (context.value && canvasBaseImage.value) {
    context.value.beginPath();
    context.value.drawImage(
      canvasBaseImage.value,
      (context.value.canvas.width - canvasBaseImage.value.width) / 2,
      (context.value.canvas.height - canvasBaseImage.value.height) / 2
    );
  }
}

function drawGridCircles() {
  if (context.value) {
    context.value.beginPath();

    for (let x = 0; x < window.innerWidth / currentScale.value; x += circleGridOffset.value) {
      for (let y = 0; y < window.innerHeight / currentScale.value; y += circleGridOffset.value) {
        context.value.rect(x, y, 3, 3);
      }
    }
    context.value.fillStyle = "#333";
    context.value.fill();
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
            drawGridCircles();
            drawImage();
          };
        }
      }

      // Infinite Canvas Event Handlers
      infiniteCanvas.value.ondraw = (event: TransformationEvent) => {
        console.log(event);
        
        currentScale.value = 1 / event.transformation.a;
      };

      infiniteCanvas.value.onwheel = (event) => {    
        if (currentScale.value <= minZoom.value && event.deltaY >= 0) {
          event.preventDefault(true);
        }

        if (currentScale.value >= maxZoom.value && event.deltaY < 0) {
            event.preventDefault(true);
        }
      };
    }, 1000);
  }
});
</script>
