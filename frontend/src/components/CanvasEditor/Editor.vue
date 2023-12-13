<template>
  <div>
    <div>
      <canvas @mousedown="baseEditorMouseDown" @mouseup="baseEditorMouseUp" @mousemove="baseEditorMouseMove"
        ref="baseEditor"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref, computed, onMounted } from "vue";

const baseEditor: Ref<HTMLCanvasElement | null> = ref(null);

const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const gridSize = ref(50);
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

const isDragging = ref(false);
const startDragPositions = ref({ x: 0, y: 0 });
const currentOffsetPositions = ref({ x: 0, y: 0 });

function drawGridCircles() {
  if (context.value) {
    context.value.beginPath();

    const startX = Math.floor(-currentOffsetPositions.value.x / gridSize.value) * gridSize.value + gridSize.value / 2;
    const startY = Math.floor(-currentOffsetPositions.value.y / gridSize.value) * gridSize.value + gridSize.value / 2;

    const finishX = startX + window.innerWidth + gridSize.value * 5
    const finishY = startY + window.innerHeight + gridSize.value * 5

    for (let x = startX; x < finishX; x += gridSize.value) {
      for (let y = startY; y < finishY; y += gridSize.value) {
        context.value.rect(x + currentOffsetPositions.value.x, y + currentOffsetPositions.value.y, 3, 3)
      }
    }


    context.value.fillStyle = "#333";
    context.value.fill();
  }
}

function baseEditorMouseMove(event: MouseEvent) {
  // const isCursorOnImage = isMouseOnImage(event.clientX, event.clientY);
  // if (isCursorOnImage && isMasking.value) {
  //   // Here we can draw masks.
  //   if (context.value) {
  //     context.value.globalCompositeOperation = "destination-out";

  //     context.value.lineTo(event.clientX, event.clientY);
  //     context.value.lineWidth = 30;
  //     context.value.lineCap = "round";
  //     context.value.lineJoin = "round";
  //     context.value.stroke();
  //   }
  // }
  if (isDragging.value) {
    const deltaX = event.clientX - startDragPositions.value.x;
    const deltaY = event.clientY - startDragPositions.value.y;

    currentOffsetPositions.value.x += deltaX;
    currentOffsetPositions.value.y += deltaY;

    updateStartDragPositions(event.clientX, event.clientY);
    updatePanning();
  }
}

function updateStartDragPositions(x: number, y: number) {
  startDragPositions.value = {
    x: x,
    y: y,
  };
}

function baseEditorMouseDown(event: MouseEvent) {
  // const isCursorOnImage = isMouseOnImage(event.clientX, event.clientY);
  // if (isCursorOnImage) {
  //   isMasking.value = true;

  //   if (context.value) {
  //     if (!lastMaskPosition.value.x) {
  //       lastMaskPosition.value.x = event.clientX;
  //     }
  //     if (!lastMaskPosition.value.y) {
  //       lastMaskPosition.value.y = event.clientY;
  //     }

  //     context.value.beginPath();
  //     context.value.globalCompositeOperation = "destination-out";
  //     context.value.lineTo(event.clientX, event.clientY);
  //     context.value.lineWidth = 30;
  //     context.value.lineCap = "round";
  //     context.value.lineJoin = "round";
  //     context.value.stroke();

  //     lastMaskPosition.value.x = event.clientX;
  //     lastMaskPosition.value.y = event.clientY;
  //   }
  // }

  isDragging.value = true;
  updateStartDragPositions(event.clientX, event.clientY);
}

function baseEditorMouseUp(event: MouseEvent) {
  isMasking.value = false;
  isDragging.value = false;
}

function clearCanvas() {
  if (context.value) {
    context.value.clearRect(
      -3 * window.innerWidth,
      -3 * window.innerHeight,
      6 * window.innerWidth,
      6 * window.innerHeight
    );
  }
}

function updatePanning() {
  clearCanvas();
  drawGridCircles();
}

onMounted(() => {
  if (baseEditor.value) {
    context.value = baseEditor.value.getContext("2d");

    baseEditor.value.width = window.innerWidth;
    baseEditor.value.height = window.innerHeight;

    canvasBaseImage.value.src = "https://i.hizliresim.com/7hyg5rc.jpg";
    canvasBaseImage.value.onload = () => {
      // drawImage(baseEditor.value?.width || 0, baseEditor.value?.height || 0);
      console.log("img load");
    };
  }

  drawGridCircles();
});
</script>

<style scoped></style>
