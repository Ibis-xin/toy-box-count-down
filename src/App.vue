<template>
  <div data-tauri-drag-region class="widget-container">
    <header class="header">
      <h1>快樂倒數</h1>

      <div class="window-controls">
        <button class="settings-trigger" @click="isSettingsOpen = true">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
            />
          </svg>
        </button>
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
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="content-card">
      <div class="stats-grid">
        <ProgressBar
          v-if="settings.showOffWork"
          label="下班"
          :progress="offWorkProgress"
          :remaining-text="offWorkCountdown"
        />

        <ProgressBar
          v-if="settings.showHoliday"
          label="週末"
          :progress="holidayProgress"
          :remaining-text="holidayCountdown"
        />

        <ProgressBar
          v-if="settings.showPayday"
          label="發薪"
          :progress="paydayProgress"
          :remaining-text="paydayCountdown"
        />
      </div>

      <div class="events-container">
        <div
          v-for="event in eventCountdowns"
          :key="event.id"
          class="resign-info"
          :class="{ 'is-hidden': event.isHidden }"
        >
          <span class="label">{{ event.name }}</span>
          <span class="value">{{ event.displayText }}</span>
          <div v-if="event.isHidden" class="mask-overlay">🙈 隱藏資訊</div>
        </div>
      </div>
    </div>

    <SettingsModal :show="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import SettingsModal from "./components/SettingsModal.vue";
import { useCountdown } from "./composables/useCountdown";
import { useSettings } from "./composables/useSettings";

const appWindow = getCurrentWindow();
const isSettingsOpen = ref(false);
const { settings } = useSettings();

const {
  offWorkCountdown,
  offWorkProgress,
  holidayCountdown,
  holidayProgress,
  paydayCountdown,
  paydayProgress,
  eventCountdowns,
} = useCountdown();

const minimizeWindow = () => appWindow.minimize();
const closeWindow = () => appWindow.close();
</script>

<style>
.header {
  background: var(--bg-app);
  backdrop-filter: blur(16px) saturate(180%);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  padding-bottom: 10px;
}

.header h1 {
  margin: 0;
  font-family: var(--font-family-title);
  font-size: var(--font-size-xl);
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

.window-controls {
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

.settings-trigger {
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
  padding: 0;
}

.settings-trigger:hover {
  background: var(--bg-glass-hover);
}

.settings-trigger svg:hover {
  color: var(--text-primary);
  transform: rotate(70deg);
}

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
  height: 100vh;
  overflow: auto;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.resign-info {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-glass-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  z-index: 4;
}

.mask-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(5px);
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: all 0.3s ease;
  letter-spacing: 2px;
  z-index: 5;
}

.resign-info.is-hidden:hover .mask-overlay {
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
