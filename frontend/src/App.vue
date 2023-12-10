<script setup lang="ts">
import { ref, type Ref } from "vue";

import KonvaEditor from "@/components/KonvaEditor/Editor.vue";
import Editor from "@/components/CanvasEditor/Editor.vue";

import TopCanvasMenu from "@/components/Menus/TopCanvasMenu.vue";
import LayerCanvasMenu from "@/components/Menus/LayerCanvasMenu.vue";
import ForgeCanvasMenu from "@/components/Menus/ForgeCanvasMenu.vue";

import { NConfigProvider, darkTheme } from "naive-ui";

const selectedTool: Ref<string | null> = ref(null);

function handleOnToolChange(tool: string) {
  selectedTool.value = tool;
}

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div>
      <div>
        <!-- <TopCanvasMenu @change="handleOnToolChange" />
        <LayerCanvasMenu />
        <ForgeCanvasMenu /> -->
      </div>
      <!-- <KonvaEditor :tool="selectedTool" /> -->
      <Editor />
    </div>
  </n-config-provider>
</template>

<style scoped lang="less">
.layerMenu {
  z-index: 10;
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  min-width: 235px;
}

.leftMenu {
  z-index: 10;
  left: 0;
  top: 0;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  width: 270px;
  height: 100%;
  max-height: 100%;
}
</style>
