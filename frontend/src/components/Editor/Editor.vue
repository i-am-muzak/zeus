<template>
  <div>
    <div id="__maskCanvasContainer">
      <canvas ref="maskBgCanvas"></canvas>
    </div>
    <div id="__editorCanvasContainer">
      <canvas ref="editor" @mousedown="editorMouseDown" @mousemove="editorMouseMove" @mouseup="editorMouseUp"
        @wheel="editorMouseWheel">
      </canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref, computed } from "vue";
import { type EditorProps } from "./Editor";

const editor: Ref<HTMLCanvasElement | null> = ref(null);
const maskBgCanvas: Ref<HTMLCanvasElement | null> = ref(null);
const maskCanvasContext: Ref<CanvasRenderingContext2D | null> = ref(null);

const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const circleGridOffset: Ref<number> = ref(75);
const canvasBaseImage = ref(new Image());

const lastMousePosRef = ref({ x: 0, y: 0 });
const ZOOM_SENSITIVITY = ref(500);
const offset = ref({ x: 0, y: 0 });
const isGrabbing = ref(false);

const viewportTopLeft = ref({ x: 0, y: 0 });
const mousePos = ref({ x: 0, y: 0 });

const scale = ref(1);
const minZoom = ref(0.5);
const maxZoom = ref(2);

const isDrawingMask = ref(false);
const canvasData = ref({ "masks": [] })
const lineMaskData: Ref<any> = ref([])

const props = defineProps<EditorProps>()

type Point = {
  x: number;
  y: number;
};

function diffPoints(p1: Point, p2: Point) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function scalePoint(p1: Point, scale: number) {
  return { x: p1.x / scale, y: p1.y / scale };
}

const computedStartX = computed(() => {
  return (
    Math.floor(viewportTopLeft.value.x / circleGridOffset.value) *
    circleGridOffset.value +
    circleGridOffset.value / 2
  );
});

const computedFinishX = computed(() => {
  return (
    computedStartX.value +
    window.innerWidth / scale.value +
    circleGridOffset.value * 5
  );
});

const computedStartY = computed(() => {
  return (
    Math.floor(viewportTopLeft.value.y / circleGridOffset.value) *
    circleGridOffset.value +
    circleGridOffset.value / 2
  );
});

const computedFinishY = computed(() => {
  return (
    computedStartY.value +
    window.innerHeight / scale.value +
    circleGridOffset.value * 5
  );
});

function updateTransform() {
  if (context.value) {
    const storedTransform = context.value.getTransform();
    context.value.canvas.width = context.value.canvas.width;
    context.value.setTransform(storedTransform);
  }
}

function drawGridCircles() {
  if (context.value) {
    context.value.beginPath();
    for (
      let x = computedStartX.value;
      x < computedFinishX.value;
      x += circleGridOffset.value
    ) {
      for (
        let y = computedStartY.value;
        y < computedFinishY.value;
        y += circleGridOffset.value
      ) {
        context.value.moveTo(x, y);
        context.value.arc(x, y, 3, 0, 2 * Math.PI);
      }
    }
    context.value.fillStyle = "#333";
    context.value.fill();
  }
}

function updateMousePos(x: number, y: number) {
  if (editor.value) {
    const viewportMousePos = { x: x, y: y };
    const topLeftCanvasPos = {
      x: editor.value.offsetLeft,
      y: editor.value.offsetTop,
    };

    mousePos.value = diffPoints(viewportMousePos, topLeftCanvasPos);
  }
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

// Editor events
function editorMouseDown(event: MouseEvent) {
  lastMousePosRef.value = {
    x: event.pageX,
    y: event.pageY,
  };
  switch (props.tool) {
    case "free-pan":
      isGrabbing.value = true;
      break;

    case "draw-mask":
      const isOnImage = isPointingImage(event.clientX, event.clientY);
      if (isOnImage) {
        isDrawingMask.value = true;

        lineMaskData.value = [];
        lineMaskData.value.push(
          {
            x: event.clientX,
            y: event.clientY,
            size: 30
          }
        )

        drawLineMask();
      }
      break;

    default:
      break;
  }
}

function handleOnFreePan(event: MouseEvent) {
  if (context.value && isGrabbing.value) {
    updateMousePos(event.clientX, event.clientY);
    const lastMousePos = lastMousePosRef.value;
    const currentMousePos = { x: event.pageX, y: event.pageY };
    lastMousePosRef.value = currentMousePos;

    const mouseDiff = diffPoints(currentMousePos, lastMousePos);
    const scaledMouseDiff = scalePoint(mouseDiff, scale.value);
    offset.value = addPoints(offset.value, scaledMouseDiff);
  }
}

function drawLineMask() {
  if (context.value) {

    context.value.beginPath();

    for (let i = 0; i < lineMaskData.value.length; i++) {
      const data = lineMaskData.value[i];
      context.value.moveTo(data.x, data.y);
      context.value.lineTo(data.x, data.y);
      context.value.lineWidth = data.size;
    }


    context.value.lineJoin = "round";
    context.value.lineCap = "round";
    context.value.globalCompositeOperation = "destination-out";
    context.value.stroke()

  }
}

function handleOnDrawMask(event: MouseEvent) {
  if (context.value && isDrawingMask.value) {
    const isOnImage = isPointingImage(event.clientX, event.clientY);
    if (isOnImage) {
      lineMaskData.value.push(
        {
          x: event.clientX,
          y: event.clientY,
          size: 30
        }
      )
      drawLineMask()
    }
  }
}

function editorMouseMove(event: MouseEvent) {
  switch (props.tool) {
    case "free-pan":
      handleOnFreePan(event);
      break;

    case "draw-mask":
      handleOnDrawMask(event);
      break
    default:
      break;
  }
}

function editorMouseUp(event: MouseEvent) {
  switch (props.tool) {
    case "free-pan":
      isGrabbing.value = false;
      break;

    case "draw-mask":
      isDrawingMask.value = false;
      if (lineMaskData.value.length) {
        canvasData.value.masks.push(lineMaskData.value)
        console.log(canvasData.value);
      }
      break

    default:
      break;
  }
}

function editorMouseWheel(event: WheelEvent) {
  if (context.value) {
    if (event.ctrlKey) {
      // Zoom in - Zoom out
      updateMousePos(event.clientX, event.clientY);
      event.preventDefault();
      var zoom = 1 - event.deltaY / ZOOM_SENSITIVITY.value;
      const viewportTopLeftDelta = {
        x: (mousePos.value.x / scale.value) * (1 - 1 / zoom),
        y: (mousePos.value.y / scale.value) * (1 - 1 / zoom),
      };
      const newViewportTopLeft = addPoints(
        viewportTopLeft.value,
        viewportTopLeftDelta
      );

      if (scale.value <= minZoom.value && event.deltaY > 0) {
        return;
      } else if (scale.value >= maxZoom.value && event.deltaY < 0) {
        return;
      }

      context.value.translate(viewportTopLeft.value.x, viewportTopLeft.value.y);
      context.value.scale(zoom, zoom);
      context.value.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

      viewportTopLeft.value = newViewportTopLeft;
      scale.value *= zoom;

      updateTransform();
      drawGridCircles();
      drawImage();
    }
    else {
      // Change vertical offset only.
      const direction = event.deltaY > 0 ? 1 : -1
      const offsetAmount = (circleGridOffset.value / 2) * direction

      offset.value = addPoints(offset.value, { x: 0, y: offsetAmount });
    }
  }
}

function isPointingImage(x: number, y: number) {
  if (context.value && canvasBaseImage.value) {
    const imageStartX = (((context.value.canvas.width - canvasBaseImage.value.width) / 2) + offset.value.x) - viewportTopLeft.value.x;
    const imageFinishX = imageStartX + canvasBaseImage.value.width;

    const imageStartY = (((context.value.canvas.height - canvasBaseImage.value.height) / 2) + offset.value.y) - viewportTopLeft.value.y;
    const imageFinishY = imageStartY + canvasBaseImage.value.height;

    const computedClientX = (x / scale.value) + offset.value.x
    const computedClientY = (y / scale.value) + offset.value.y


    // Check horizontally and vertically
    if (imageStartX <= computedClientX && imageFinishX >= computedClientX && imageStartY <= computedClientY && imageFinishY >= computedClientY) {
      return true
    }

    return false
  }
}
// ---- //

function drawMaskBackgroundLines() {
  if (maskCanvasContext.value) {
    maskCanvasContext.value.beginPath();


    maskCanvasContext.value.drawImage(canvasBaseImage.value, (context.value.canvas.width - canvasBaseImage.value.width) / 2,
      (context.value.canvas.height - canvasBaseImage.value.height) / 2)

    maskCanvasContext.value.rect((context.value.canvas.width - canvasBaseImage.value.width) / 2,
      (context.value.canvas.height - canvasBaseImage.value.height) / 2, canvasBaseImage.value.width, canvasBaseImage.value.height)

    maskCanvasContext.value.fillStyle = "rgba(252, 74, 255, .15)";
    maskCanvasContext.value.fill()

    maskCanvasContext.value.beginPath();
    
    
    for (let i = 0; i < window.innerWidth; i += 3) {
      for (let y = 0; y < window.innerHeight; y += 3) {
        const isInsideImage = isPointingImage(i, y)
        if (isInsideImage) {
          maskCanvasContext.value.rect(i, y, 1, 1)
        }
      }
    }

    maskCanvasContext.value.fillStyle = "rgba(252, 74, 255, 1)";
    maskCanvasContext.value.fill()
    maskCanvasContext.value.strokeStyle = "rgba(255, 255, 255, .1)"
    maskCanvasContext.value.stroke()
  }
}

watch(
  offset,
  (newValue, oldValue) => {
    if (context.value) {
      const offsetDiff = scalePoint(diffPoints(newValue, oldValue), 1);
      context.value.translate(offsetDiff.x, offsetDiff.y);
      viewportTopLeft.value = diffPoints(viewportTopLeft.value, offsetDiff);

      updateTransform();
      drawGridCircles();
      drawImage();
    }
  },
  {
    deep: true,
  }
);

onMounted(() => {
  if (editor.value) {
    editor.value.width = window.innerWidth;
    editor.value.height = window.innerHeight;

    context.value = editor.value.getContext("2d");

    canvasBaseImage.value.src = "https://i.hizliresim.com/7hyg5rc.jpg";
    canvasBaseImage.value.onload = () => {
      drawImage();
    };

    drawGridCircles();
  }

  if (maskBgCanvas.value) {
    maskBgCanvas.value.width = window.innerWidth;
    maskBgCanvas.value.height = window.innerHeight;

    maskCanvasContext.value = maskBgCanvas.value.getContext("2d");

    drawMaskBackgroundLines()
  }
});
</script>


<style lang="less">
#__maskCanvasContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: transparent;
  z-index: -1;
}

#__editorCanvasContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: transparent;
}
</style>