<template>
  <div data-tauri-drag-region class="progress-bar-wrapper">
    <div data-tauri-drag-region class="progress-info">
      <span data-tauri-drag-region class="label">{{ label }}</span>
      <span data-tauri-drag-region class="remaining-text">{{
        remainingText
      }}</span>
    </div>
    <div data-tauri-drag-region class="progress-container">
      <div
        data-tauri-drag-region
        class="progress-fill"
        :style="{ width: `${progress}%` }"
      >
        <div data-tauri-drag-region class="progress-glow"></div>
      </div>
    </div>
    <div data-tauri-drag-region class="progress-percentage">
      {{ progress }}%
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  progress: number;
  remainingText: string;
}>();
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
  margin-bottom: 12px;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  color: #fff;
  user-select: none;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4px;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.remaining-text {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.7;
}

.progress-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-percentage {
  margin-top: 4px;
  text-align: right;
  font-size: 0.7rem;
  font-weight: 500;
  opacity: 0.5;
}
</style>
