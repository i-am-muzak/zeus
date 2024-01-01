<script setup lang="ts">

import {NConfigProvider, lightTheme} from "naive-ui";
</script>

<template>
    <n-config-provider :theme="lightTheme">
        <div>
            <RouterView />
        </div>
    </n-config-provider>
</template>