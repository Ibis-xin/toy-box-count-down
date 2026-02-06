<template>
  <div class="widget-container">
    <div data-tauri-drag-region class="drag-region"></div>

    <div class="window-controls">
      <button class="control-btn minimize" @click="minimizeWindow">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <line
            x1="0"
            y1="0.5"
            x2="10"
            y2="0.5"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
      <button class="control-btn close" @click="closeWindow">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    </div>

    <div class="content-card">
      <header class="header">
        <h1>快樂倒數</h1>
        <div class="status-dot"></div>
      </header>

      <div class="stats-grid">
        <ProgressBar
          label="下班"
          :progress="offWorkProgress"
          :remaining-text="offWorkCountdown"
        />

        <ProgressBar
          label="週五"
          :progress="holidayProgress"
          :remaining-text="holidayCountdown"
        />

        <div class="resign-info" v-if="daysToResign > 0">
          <span class="label">離職</span>
          <span class="value">{{ daysToResign }}<small>天</small></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCountdown } from "./composables/useCountdown";
import ProgressBar from "./components/ProgressBar.vue";

const appWindow = getCurrentWindow();

const {
  offWorkCountdown,
  holidayCountdown,
  daysToResign,
  offWorkProgress,
  holidayProgress,
} = useCountdown();

const minimizeWindow = () => appWindow.minimize();
const closeWindow = () => appWindow.close();
</script>

<style>
:root {
  color-scheme: dark;
}

body {
  margin: 0;
  overflow: hidden;
  background: transparent !important;
}

.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.drag-region:active {
  cursor: grabbing;
}

.content-card {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  padding: 16px;
  padding-top: 10px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.window-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 12;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.control-btn.close:hover {
  background: #ef4444;
}

.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  padding-right: 46px;
}

.header h1 {
  font-family: "Outfit", sans-serif;
  font-size: 1.1rem;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
}

.resign-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  margin-top: 4px;
}

.resign-info .label {
  font-size: 0.75rem;
  opacity: 0.6;
}

.resign-info .value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f43f5e;
}

.resign-info .value small {
  font-size: 0.6rem;
  opacity: 0.5;
  margin-left: 1px;
}
</style>
