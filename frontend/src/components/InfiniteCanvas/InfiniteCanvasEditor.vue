<template>
  <div>
    <canvas ref="canvasEditor"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from "vue";
import Canvas, {
  type InfiniteCanvasRenderingContext2D,
  type InfiniteCanvas,
} from "ef-infinite-canvas";

const infiniteCanvas: Ref<InfiniteCanvas | null> = ref(null);
const canvasEditor: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<InfiniteCanvasRenderingContext2D | null> = ref(null);
const canvasBaseImage: Ref<HTMLImageElement | null> = ref(new Image());

function drawImage() {
  if (context.value && canvasBaseImage.value) {
    context.value.drawImage(
      canvasBaseImage.value,
      (context.value.canvas.width - canvasBaseImage.value.width) / 2,
      (context.value.canvas.height - canvasBaseImage.value.height) / 2,
    );
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
            drawImage();
          };
        }
      }
    }, 1000);
  }
});
</script>
