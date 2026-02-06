<template>
  <div data-tauri-drag-region class="widget-container">
    <header data-tauri-drag-region class="header">
      <h1 data-tauri-drag-region>快樂倒數</h1>

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
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
      </div>
    </header>

    <div data-tauri-drag-region class="content-card">
      <div data-tauri-drag-region class="stats-grid">
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

      <div data-tauri-drag-region class="events-container">
        <div
          v-for="event in eventCountdowns"
          :key="event.id"
          data-tauri-drag-region
          class="resign-info"
          :class="{ 'is-hidden': event.isHidden }"
        >
          <span data-tauri-drag-region class="label">{{ event.name }}</span>
          <span data-tauri-drag-region class="value">{{ event.displayText }}</span>
          <div v-if="event.isHidden" data-tauri-drag-region class="mask-overlay">
            🙈 隱藏資訊
          </div>
        </div>
      </div>
    </div>

    <SettingsModal :show="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window";
import { enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { onMounted, ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import SettingsModal from "./components/SettingsModal.vue";
import { useCountdown } from "./composables/useCountdown";
import { useSettings } from "./composables/useSettings";

const appWindow = getCurrentWindow();
const isSettingsOpen = ref(false);
const { settings } = useSettings();

onMounted(async () => {
  // 自動開啟開機自啟
  try {
    const isAutoStartEnabled = await isEnabled();
    if (!isAutoStartEnabled) {
      await enable();
    }
  } catch (err) {
    console.error("Failed to enable autostart:", err);
  }
});

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
/* Layout & Container */
.widget-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header Section */
.header {
  background: var(--bg-app);
  backdrop-filter: blur(16px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  z-index: 4;
}

.header h1 {
  margin: 0;
  font-family: var(--font-family-title);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.window-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn,
.settings-trigger {
  background: var(--bg-glass);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn:hover,
.settings-trigger:hover {
  background: var(--bg-glass-hover);
  color: var(--text-primary);
}

.control-btn.close:hover {
  background: var(--color-danger);
}

.settings-trigger svg {
  transition: transform var(--transition-fast);
}

.settings-trigger:hover svg {
  transform: rotate(70deg);
}

/* Stats & Events */
.content-card {
  background: var(--bg-app);
  backdrop-filter: blur(16px) saturate(180%);
  padding: var(--spacing-lg);
  padding-top: 10px;
  position: relative;
  z-index: 2;
  box-shadow: var(--shadow-card);
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
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
}

.mask-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(5px);
  background: rgba(15, 23, 42, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: all var(--transition-base);
  letter-spacing: 2px;
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
