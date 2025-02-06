<script setup lang="ts">
import { ref } from "vue";
import {
  NConfigProvider,
  NMessageProvider,
  NLoadingBarProvider,
  NDialogProvider,
  NNotificationProvider,
  type GlobalThemeOverrides,
  darkTheme,
} from "naive-ui";
import type { GlobalTheme, MessageProviderProps } from "naive-ui";
import AppWrapper from "./views/AppWrapper.vue";

const messagePlacement = ref<MessageProviderProps["placement"]>("top");

const theme = ref<GlobalTheme>(darkTheme);

const themeOverrides: GlobalThemeOverrides = {};
</script>

<template>
  <div class="main">
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
      <n-loading-bar-provider>
        <n-message-provider :placement="messagePlacement" :max="1">
          <n-dialog-provider>
            <n-notification-provider :max="1">
              <AppWrapper />
            </n-notification-provider>
          </n-dialog-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-config-provider>
  </div>
</template>

<style scoped></style>
