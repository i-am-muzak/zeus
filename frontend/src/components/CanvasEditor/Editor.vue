<template>
  <div>
    <button @click="resetCanvas">Reset</button>
    <pre>scale: {{ scale }}</pre>
    <pre>offset: {{ offset }}</pre>
    <pre>viewportTopLeft: {{ viewportTopLeft }}</pre>
    <canvas
      ref="canvasRef"
      :width="canvasWidth * ratio"
      :height="canvasHeight * ratio"
      @mousedown="startPan"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @wheel="handleWheel"
      style="border: 2px solid #000"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: {
    canvasWidth: {
      type: Number,
      default: 800
    },
    canvasHeight: {
      type: Number,
      default: 400
    },
  },
  data() {
    return {
      ratio: window.devicePixelRatio || 1,
      context: null,
      scale: 1,
      offset: { x: 0, y: 0 },
      mousePos: { x: 0, y: 0 },
      viewportTopLeft: { x: 0, y: 0 },
      isReset: false,
      lastMousePos: { x: 0, y: 0 },
      lastOffset: { x: 0, y: 0 },
    };
  },
  methods: {
    resetCanvas() {
      if (this.context && !this.isReset) {
        const context = this.context;
        context.canvas.width = this.canvasWidth * this.ratio;
        context.canvas.height = this.canvasHeight * this.ratio;
        context.scale(this.ratio, this.ratio);
        this.scale = 1;

        this.context = context;
        this.offset = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.viewportTopLeft = { x: 0, y: 0 };
        this.lastOffset = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };

        this.isReset = true;
      }
    },
    mouseMove(event) {
      if (this.context) {
        const lastMousePos = this.lastMousePos;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        this.lastMousePos = currentMousePos;

        const mouseDiff = this.diffPoints(currentMousePos, lastMousePos);
        this.offset = this.addPoints(this.offset, mouseDiff);
      }
    },
    mouseUp() {
      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);
    },
    startPan(event) {
      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseUp);
      this.lastMousePos = { x: event.pageX, y: event.pageY };
    },
    handleWheel(event) {
      event.preventDefault();
      if (this.context) {
        const zoom = 1 - event.deltaY / 500;
        const viewportTopLeftDelta = {
          x: (this.mousePos.x / this.scale) * (1 - 1 / zoom),
          y: (this.mousePos.y / this.scale) * (1 - 1 / zoom),
        };
        const newViewportTopLeft = this.addPoints(
          this.viewportTopLeft,
          viewportTopLeftDelta
        );

        this.context.translate(this.viewportTopLeft.x, this.viewportTopLeft.y);
        this.context.scale(zoom, zoom);
        this.context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

        this.viewportTopLeft = newViewportTopLeft;
        this.scale = this.scale * zoom;
        this.isReset = false;
      }
    },
    diffPoints(p1, p2) {
      return { x: p1.x - p2.x, y: p1.y - p2.y };
    },
    addPoints(p1, p2) {
      return { x: p1.x + p2.x, y: p1.y + p2.y };
    },
  },
  mounted() {
    const canvasRef = this.$refs.canvasRef;
    if (canvasRef) {
      const context = canvasRef.getContext("2d");
      if (context) {
        this.context = context;
        this.resetCanvas();
      }
    }
  },
};
</script>
