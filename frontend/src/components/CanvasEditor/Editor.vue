<template>
  <div>
    <div>
      <canvas
        @mousedown="baseEditorMouseDown"
        @mouseup="baseEditorMouseUp"
        @mousemove="baseEditorMouseMove"
        @wheel="baseEditorOnWheel"
        ref="baseEditor"
      ></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { update } from "lodash";
import { ref, type Ref, computed, onMounted } from "vue";

const baseEditor: Ref<HTMLCanvasElement | null> = ref(null);

const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const gridOffset = ref(50);
const gridSize = ref(3);

const canvasBaseImage = ref(new Image());
const isMasking = ref(false);

const isDragging = ref(false);
const startDragPositions = ref({ x: 0, y: 0 });
const currentOffsetPositions = ref({ x: 0, y: 0 });
const wheelOffsetSize = ref(30);

// Scale stuff
const currentScale = ref(1);
const scaleAmount = ref(0.1);

const computedGridOffset = computed(() => {
  return gridOffset.value;
});

const computedStartX = computed(() => {
  return (
    Math.floor(-currentOffsetPositions.value.x / computedGridOffset.value) *
      computedGridOffset.value +
    computedGridOffset.value / 2
  );
});

const computedFinishX = computed(() => {
  console.log(
    `Offset X: ${currentOffsetPositions.value.x} - Start: ${
      computedStartX.value
    } - Finish: ${
      ((computedStartX.value +
        window.innerWidth / currentScale.value +
        computedGridOffset.value * 5))
      
    }`
  );

  return (
    ((computedStartX.value +
        window.innerWidth / currentScale.value +
        computedGridOffset.value * 5))
    
  );
});

const computedStartY = computed(() => {
  return (
    Math.floor(-currentOffsetPositions.value.y / computedGridOffset.value) *
      computedGridOffset.value +
    computedGridOffset.value / 2
  );
});

const computedFinishY = computed(() => {
  return (
    (computedStartY.value + window.innerHeight + computedGridOffset.value * 5) /
    currentScale.value
  );
});

function updateCanvasScale(x: number, y: number) {
  if (context.value) {
    context.value.setTransform(1, 0, 0, 1, 0, 0);
    context.value.scale(x, y);
  }
}

function baseEditorOnWheel(event: WheelEvent) {
  event.preventDefault();
  const direction = event.deltaY < 0 ? -1 : 1;
  // Here we add zooming when pressing CTRL
  if (event.ctrlKey) {
    // const mousePointTo = {
    //   x: (event.clientX - konvaStage.value.getNode().x()) / oldScale,
    //   y: (event.clientY - konvaStage.value.getNode().y()) / oldScale,
    // };

    const scale = scaleAmount.value * direction;
    if (currentScale.value >= 0.5 && currentScale.value <= 2) {
      currentScale.value = Math.round((currentScale.value + scale) * 10) / 10;
      if (currentScale.value < 0.5) currentScale.value = 0.5;
      if (currentScale.value > 2) currentScale.value = 2;

      updateCanvasScale(currentScale.value, currentScale.value);
      updatePanning();
    }
  }
  // Here we only change offset.
  else {
    currentOffsetPositions.value.y +=
      (direction * wheelOffsetSize.value) / currentScale.value;

    updateCanvasPosition(
      0,
      (direction * wheelOffsetSize.value) / currentScale.value
    );
    updatePanning();
  }
}

function drawGridCircles() {
  if (context.value) {
    context.value.beginPath();

    const computedGridSize = gridSize.value;

    for (
      let x = computedStartX.value;
      x < computedFinishX.value;
      x += computedGridOffset.value
    ) {
      for (
        let y = computedStartY.value;
        y < computedFinishY.value;
        y += computedGridOffset.value
      ) {
        context.value.rect(x, y, computedGridSize, computedGridSize);
      }
    }

    context.value.fillStyle = "#333";
    context.value.fill();
  }
}

function updateCanvasPosition(x: number, y: number) {
  if (context.value) {
    context.value.translate(x, y);
  }
}

function baseEditorMouseMove(event: MouseEvent) {
  if (isDragging.value) {
    const deltaX =
      (event.clientX - startDragPositions.value.x) / currentScale.value;
    const deltaY =
      (event.clientY - startDragPositions.value.y) / currentScale.value;

    currentOffsetPositions.value.x += deltaX;
    currentOffsetPositions.value.y += deltaY;

    updateCanvasPosition(deltaX, deltaY);
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
      computedStartX.value - gridOffset.value,
      computedStartY.value - gridOffset.value,
      (computedFinishX.value - computedStartX.value) * 2,
      (computedFinishY.value - computedStartY.value) * 2
    );
  }
}

function updatePanning() {
  clearCanvas();
  drawGridCircles();
  drawImage();
}

function drawImage() {
  if (context.value) {
    context.value.drawImage(
      canvasBaseImage.value,
      (context.value.canvas.width - canvasBaseImage.value.width) / 2,
      (context.value.canvas.height - canvasBaseImage.value.height) / 2
    );
  }
}

onMounted(() => {
  if (baseEditor.value) {
    context.value = baseEditor.value.getContext("2d");

    baseEditor.value.width = window.innerWidth;
    baseEditor.value.height = window.innerHeight;

    canvasBaseImage.value.src = "https://i.hizliresim.com/7hyg5rc.jpg";
    canvasBaseImage.value.onload = () => {
      drawImage();
    };
  }

  drawGridCircles();
});
</script>

<style scoped></style>
