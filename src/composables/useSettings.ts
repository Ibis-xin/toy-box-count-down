import { reactive, watch } from "vue";

export interface SpecialEvent {
  id: string;
  name: string;
  date: string;
  isHidden: boolean;
}

export interface UserSettings {
  workStartTime: string;
  workEndTime: string;
  payday: number;
  showOffWork: boolean;
  showHoliday: boolean;
  showPayday: boolean;
  events: SpecialEvent[];
}

const STORAGE_KEY = "toy-box-settings";

const defaultSettings: UserSettings = {
  workStartTime: "08:30",
  workEndTime: "17:30",
  payday: 5,
  showOffWork: true,
  showHoliday: true,
  showPayday: false,
  events: [
    {
      id: "resign-default",
      name: "離職",
      date: "2028-01-15",
      isHidden: true,
    },
  ],
};

// 從 localStorage 讀取初始值
const loadSettings = (): UserSettings => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultSettings };
  try {
    return { ...defaultSettings, ...JSON.parse(saved) };
  } catch (e) {
    console.error("Failed to parse settings:", e);
    return { ...defaultSettings };
  }
};

// 全域共用的響應式狀態
const settings = reactive<UserSettings>(loadSettings());

// 自動儲存變更
watch(
  settings,
  (newSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  },
  { deep: true },
);

export function useSettings() {
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    Object.assign(settings, newSettings);
  };

  const addEvent = (event: Omit<SpecialEvent, "id">) => {
    settings.events.push({
      ...event,
      id: crypto.randomUUID(),
    });
  };

  const removeEvent = (id: string) => {
    settings.events = settings.events.filter((e) => e.id !== id);
  };

  const updateEvent = (id: string, updates: Partial<SpecialEvent>) => {
    const index = settings.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      settings.events[index] = { ...settings.events[index], ...updates };
    }
  };

  return {
    settings,
    updateSettings,
    addEvent,
    removeEvent,
    updateEvent,
  };
}
