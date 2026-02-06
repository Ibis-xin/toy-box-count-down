<template>
  <Transition name="fade">
    <div v-if="show" class="settings-overlay" @click.self="handleClose">
      <div class="settings-modal">
        <header class="settings-header">
          <div class="header-left">
            <button
              v-if="activeTab !== 'menu'"
              class="back-btn"
              @click="activeTab = 'menu'"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2>{{ tabTitles[activeTab] }}</h2>
          </div>
          <button class="close-btn" @click="handleClose">&times;</button>
        </header>

        <main class="settings-content">
          <Transition :name="transitionName" mode="out-in">
            <!-- 主選單 -->
            <div v-if="activeTab === 'menu'" class="menu-list">
              <button class="menu-item" @click="activeTab = 'display'">
                <span class="menu-icon">👁️</span>
                <span class="menu-label">顯示項目</span>
                <span class="menu-arrow">›</span>
              </button>
              <button class="menu-item" @click="activeTab = 'time'">
                <span class="menu-icon">📅</span>
                <span class="menu-label">時間與日期設定</span>
                <span class="menu-arrow">›</span>
              </button>
              <button class="menu-item" @click="activeTab = 'events'">
                <span class="menu-icon">🎉</span>
                <span class="menu-label">特殊日期倒數</span>
                <span class="menu-arrow">›</span>
              </button>
            </div>

            <!-- 顯示項目設定 -->
            <div v-else-if="activeTab === 'display'" class="submenu-content">
              <div class="switch-group">
                <div class="switch-item">
                  <label>下班倒數</label>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.showOffWork" />
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="switch-item">
                  <label>週末倒數</label>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.showHoliday" />
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="switch-item">
                  <label>發薪倒數</label>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.showPayday" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 時間與日期設定 -->
            <div v-else-if="activeTab === 'time'" class="submenu-content">
              <div class="input-stack">
                <div class="input-item-row">
                  <label>上班時間</label>
                  <input type="time" v-model="settings.workStartTime" />
                </div>
                <div class="input-item-row">
                  <label>下班時間</label>
                  <input type="time" v-model="settings.workEndTime" />
                </div>
                <div class="input-item-row">
                  <label>發薪日期</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    v-model.number="settings.payday"
                  />
                </div>
              </div>
            </div>

            <!-- 特殊事件設定 -->
            <div v-else-if="activeTab === 'events'" class="submenu-content">
              <div class="section-header">
                <span class="info-text">管理您的特殊紀念日期</span>
                <button class="add-btn" @click="handleAddEvent">+ 新增</button>
              </div>
              <div class="events-list">
                <div v-for="event in settings.events" :key="event.id" class="event-item">
                  <div class="event-inputs">
                    <input type="text" v-model="event.name" placeholder="事件名稱" />
                    <input type="date" v-model="event.date" />
                  </div>
                  <div class="event-actions">
                    <button
                      class="privacy-toggle"
                      :class="{ active: event.isHidden }"
                      @click="event.isHidden = !event.isHidden"
                    >
                      {{ event.isHidden ? "🙈 隱藏中" : "👁️ 顯示中" }}
                    </button>
                    <button class="delete-btn" @click="removeEvent(event.id)">
                      🗑️ 刪除
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="settings.events.length === 0" class="empty-state">
                暫無特殊事件
              </div>
            </div>
          </Transition>
        </main>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSettings } from "../composables/useSettings";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { settings, addEvent, removeEvent } = useSettings();
const activeTab = ref<"menu" | "display" | "time" | "events">("menu");
const transitionName = ref("slide-right");

const tabTitles = {
  menu: "系統設定",
  display: "顯示項目",
  time: "時間與日期",
  events: "特殊事件",
};

// 切換 tab 時調整動畫方向
watch(activeTab, (newTab, oldTab) => {
  if (newTab === "menu") {
    transitionName.value = "slide-left";
  } else {
    transitionName.value = "slide-right";
  }
});

const handleClose = () => {
  emit("close");
  // 關閉後重置回選單頁
  setTimeout(() => {
    activeTab.value = "menu";
  }, 300);
};

const handleAddEvent = () => {
  addEvent({
    name: "新事件",
    date: new Date().toISOString().split("T")[0],
    isHidden: false,
  });
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.settings-modal {
  background: var(--bg-app);
  height: 100vh;
  width: 100vw;
  border-left: 1px solid var(--border-glass);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
}

.settings-header {
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-glass);
  height: 15px !important;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-header h2 {
  font-size: 1rem;
  margin: 0;
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
}

.back-btn {
  background: var(--bg-glass);
  border: none;
  color: var(--text-primary);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.settings-content {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
  position: relative;
}

/* 主選單樣式 */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  background: var(--bg-glass-light);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.menu-item:hover {
  background: var(--bg-glass-hover);
  transform: translateX(4px);
}

.menu-icon {
  font-size: 1.2rem;
  margin-right: 12px;
}

.menu-label {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: var(--font-weight-medium);
}

.menu-arrow {
  color: var(--text-secondary);
  font-size: 1.2rem;
  opacity: 0.5;
}

/* 子選單共用 */
.submenu-content {
  width: 100%;
}

.switch-group,
.input-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.switch-item,
.input-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--bg-glass-light);
  padding: 10px 12px;
  border-radius: var(--radius-md);
}

.switch-item label,
.input-item-row label {
  font-size: 0.85rem;
  color: var(--text-primary);
  opacity: 0.8;
}

/* Switch UI */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--bg-glass-hover);
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(
    135deg,
    var(--primary-gradient-start),
    var(--primary-gradient-end)
  );
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input[type="time"],
input[type="number"],
input[type="date"],
input[type="text"] {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 6px 8px;
  font-size: 0.85rem;
  outline: none;
  width: 100px;
  text-align: center;
}

input[type="text"] {
  width: 100%;
  text-align: left;
}

/* 特殊事件特有 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  background: var(--bg-glass-light);
  padding: 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-glass);
}

.event-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.privacy-toggle,
.delete-btn {
  flex: 1;
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  padding: 6px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.privacy-toggle.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--primary-gradient-start);
}

.add-btn {
  background: linear-gradient(
    135deg,
    var(--primary-gradient-start),
    var(--primary-gradient-end)
  );
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.5;
}

/* 動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .settings-modal {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from .settings-modal {
  transform: translateX(100%);
}
.fade-leave-to .settings-modal {
  transform: translateX(100%);
}

/* Tab 切換動畫 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
