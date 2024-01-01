<template>
    <div>
        <div class="menu-section">
            <TopCanvasMenu />
        </div>
        <div>
            <KonvaEditor />
        </div>
    </div>
</template>

<script setup lang="ts">
import KonvaEditor from "@/components/KonvaEditor/Editor.vue";
import TopCanvasMenu from "@/components/Menus/TopCanvasMenu.vue";

</script>

<style scoped>

</style>