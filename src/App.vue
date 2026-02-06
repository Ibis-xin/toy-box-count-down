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

        <ProgressBar
          label="發薪"
          :progress="paydayProgress"
          :remaining-text="paydayCountdown"
        />
      </div>

      <div class="resign-info" v-if="daysToResign > 0">
        <span class="label">離職</span>
        <span class="value">{{ daysToResign }}<small>天</small></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import ProgressBar from "./components/ProgressBar.vue";
import { useCountdown } from "./composables/useCountdown";

const appWindow = getCurrentWindow();

const {
  offWorkCountdown,
  offWorkProgress,
  holidayCountdown,
  holidayProgress,
  paydayCountdown,
  paydayProgress,
  daysToResign,
} = useCountdown();

const minimizeWindow = () => appWindow.minimize();
const closeWindow = () => appWindow.close();
</script>

<style>
.drag-region {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  width: 100%;
  height: 20%;
}

.content-card {
  background: var(--bg-app);
  backdrop-filter: blur(16px) saturate(180%);
  padding: var(--spacing-lg);
  padding-top: 10px;
  position: relative;
  z-index: 2;
  box-shadow: var(--shadow-card);
}

.window-controls {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  z-index: 4;
}

.control-btn {
  background: var(--bg-glass);
  border: none;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--bg-glass-hover);
  color: var(--text-primary);
}

.control-btn.close:hover {
  background: var(--color-danger);
}

.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-right: 46px;
}

.header h1 {
  font-family: var(--font-family-title);
  font-size: var(--font-size-xl);
  margin: 0;
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--text-secondary) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: var(--font-weight-bold);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-dot);
}

.resign-info {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-glass-light);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-xs);
  overflow: hidden;
  z-index: 4; /* 提高容器層級，使其高於拖曳層 (z-3) */
}

.resign-info::after {
  content: "🙈 隱藏資訊";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.resign-info:hover::after {
  opacity: 0;
  transform: scale(1.1);
  pointer-events: none;
}

.resign-info .label {
  font-size: var(--font-size-base);
  opacity: var(--opacity-secondary);
}

.resign-info .value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-danger-alt);
}

.resign-info .value small {
  font-size: var(--font-size-xs);
  opacity: var(--opacity-muted);
  margin-left: 1px;
}
</style>
