<template>
  <div>
    <div>
      <canvas
        ref="maskBackgroundStage"
      ></canvas>
      <canvas
        @mousedown="baseEditorMouseDown"
        @mouseup="baseEditorMouseUp"
        @mousemove="baseEditorMouseMove"
        ref="baseEditor"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed, onMounted } from "vue";

const baseEditor: Ref<HTMLCanvasElement | null> = ref(null);
const maskBackgroundStage: Ref<HTMLCanvasElement | null> = ref(null);
  
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const gridOffset = ref(50);
const imagePosition: Ref<any> = ref({
  x: 0,
  y: 0,
});

const canvasBaseImage = ref(new Image());
const isMasking = ref(false);
const lastMaskPosition: Ref<any> = ref({
  x: 0,
  y: 0,
});

const computedGridCircles = computed(() => {
  var coords = [];
  for (
    let x = gridOffset.value / 2;
    x < window.innerWidth;
    x += gridOffset.value
  ) {
    for (
      let y = gridOffset.value / 2;
      y < window.innerHeight;
      y += gridOffset.value
    ) {
      coords.push({
        x,
        y,
      });
    }
  }
  console.log(coords);

  return coords;
});

function drawGridCircles() {
  console.log(computedGridCircles.value.length);
  if (baseEditor.value) {
    const ctx = baseEditor.value.getContext("2d");

    if (ctx) {
      for (let i = 0; i < computedGridCircles.value.length; i++) {
        const coord = computedGridCircles.value[i];
        ctx.rect(coord.x, coord.y, 3, 3);
        ctx.fillStyle = "#333";
        ctx.fill();
      }
    }
  }
}

function drawImage(canvasWidth: number, canvasHeight: number) {
  if (context.value && canvasWidth && canvasHeight) {
    const context = baseEditor.value?.getContext("2d");
    if (context) {
      const startX = (canvasWidth - canvasBaseImage.value.width) / 2;
      const startY = (canvasHeight - canvasBaseImage.value.height) / 2;

      context.drawImage(
        canvasBaseImage.value,
        startX,
        startY,
        canvasBaseImage.value.width,
        canvasBaseImage.value.height
      );

      imagePosition.value.x = startX;
      imagePosition.value.y = startY;
    }
  }
}

function isMouseOnImage(clientX: number, clientY: number) {
  if (canvasBaseImage.value) {
    if (
      clientX >= imagePosition.value.x &&
      clientX <= imagePosition.value.x + canvasBaseImage.value.width &&
      clientY >= imagePosition.value.y &&
      clientY <= imagePosition.value.y + canvasBaseImage.value.height
    ) {
      return true;
    }
  }
  return false;
}

function baseEditorMouseMove(event: MouseEvent) {
  const isCursorOnImage = isMouseOnImage(event.clientX, event.clientY);
  if (isCursorOnImage && isMasking.value) {
    // Here we can draw masks.
    if (context.value) {
      
      context.value.globalCompositeOperation = "destination-out";

      context.value.lineTo(event.clientX, event.clientY);
      context.value.lineWidth = 30;
      context.value.lineCap = "round";
      context.value.lineJoin = "round";
      context.value.stroke();
    }
  }
}

function baseEditorMouseDown(event: MouseEvent) {
  const isCursorOnImage = isMouseOnImage(event.clientX, event.clientY);
  if (isCursorOnImage) {
    isMasking.value = true;

    if (context.value) {
      if (!lastMaskPosition.value.x) {
        lastMaskPosition.value.x = event.clientX;
      }
      if (!lastMaskPosition.value.y) {
        lastMaskPosition.value.y = event.clientY;
      }

      context.value.beginPath();
      context.value.globalCompositeOperation = "destination-out";
      context.value.lineTo(event.clientX, event.clientY);
      context.value.lineWidth = 30;
      context.value.lineCap = "round";
      context.value.lineJoin = "round";
      context.value.stroke();

      lastMaskPosition.value.x = event.clientX;
      lastMaskPosition.value.y = event.clientY;
    }
  }
}

function baseEditorMouseUp(event: MouseEvent) {
  isMasking.value = false;
}

onMounted(() => {
  if (baseEditor.value) {
    context.value = baseEditor.value.getContext("2d");

    baseEditor.value.width = window.innerWidth;
    baseEditor.value.height = window.innerHeight;

    canvasBaseImage.value.src = "https://i.hizliresim.com/7hyg5rc.jpg";
    canvasBaseImage.value.onload = () => {
      drawImage(baseEditor.value?.width || 0, baseEditor.value?.height || 0);
    };
  }

  drawGridCircles();
});
</script>

<style scoped></style>
