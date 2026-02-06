import dayjs from "dayjs";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useSettings } from "./useSettings";

export function useCountdown() {
  const { settings } = useSettings();
  const now = ref(dayjs());
  let timer: number;

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = dayjs();
    }, 1000);
  });

  onUnmounted(() => clearInterval(timer));

  // 輔助函式：解析 HH:mm 字串
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return dayjs().hour(h).minute(m).second(0);
  };

  /** 距離下班剩餘時間 */
  const offWorkCountdown = computed(() => {
    const target = parseTime(settings.workEndTime);
    const diff = target.diff(now.value, "second");

    if (diff <= 0) return "已下班囉！";

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h}h ${m}m ${s}s`;
  });

  /** 下班進度百分比 */
  const offWorkProgress = computed(() => {
    const start = parseTime(settings.workStartTime);
    const end = parseTime(settings.workEndTime);

    const total = end.diff(start, "second");
    const current = now.value.diff(start, "second");

    if (current <= 0) return 0;
    if (current >= total) return 100;
    return Math.floor((current / total) * 100);
  });

  /** 距離週五放假 (假設週五下班即放假) */
  const holidayCountdown = computed(() => {
    const [h, m] = settings.workEndTime.split(":").map(Number);
    const friday = dayjs().day(5).hour(h).minute(m).second(0);

    const diff = friday.diff(now.value, "day");
    const diff_h = friday.diff(now.value, "hour");

    if (now.value.isAfter(friday)) return "假期中";
    return diff > 0 ? `${diff} 天` : `${diff_h} 小時`;
  });

  /** 本週放假進度百分比 (週一上班到週五下班) */
  const holidayProgress = computed(() => {
    const [startH, startM] = settings.workStartTime.split(":").map(Number);
    const [endH, endM] = settings.workEndTime.split(":").map(Number);

    const start = dayjs().day(1).hour(startH).minute(startM).second(0);
    const end = dayjs().day(5).hour(endH).minute(endM).second(0);

    const total = end.diff(start, "second");
    const current = now.value.diff(start, "second");

    if (current <= 0) return 0;
    if (current >= total) return 100;
    return Math.floor((current / total) * 100);
  });

  /** 距離發薪日 */
  const paydayCountdown = computed(() => {
    let payday = dayjs().date(settings.payday).hour(0).minute(0).second(0);
    if (now.value.isAfter(payday)) {
      payday = payday.add(1, "month");
    }
    const diff = payday.diff(now.value, "day");
    return `${diff} 天`;
  });

  /** 發薪日進度百分比 */
  const paydayProgress = computed(() => {
    let end = dayjs().date(settings.payday).hour(0).minute(0).second(0);
    if (now.value.isAfter(end)) {
      end = end.add(1, "month");
    }
    const start = end.subtract(1, "month");

    const total = end.diff(start, "second");
    const current = now.value.diff(start, "second");

    if (current <= 0) return 0;
    if (current >= total) return 100;
    return Math.floor((current / total) * 100);
  });

  /** 特殊事件倒數列表 */
  const eventCountdowns = computed(() => {
    return settings.events.map((event) => {
      const target = dayjs(event.date).hour(0).minute(0).second(0);
      const diff = target.diff(now.value, "day");
      return {
        ...event,
        days: diff,
        displayText:
          diff > 0
            ? `${diff} 天`
            : diff === 0
              ? "就在今天！"
              : `已過 ${Math.abs(diff)} 天`,
      };
    });
  });

  // 為了相容舊版 App.vue，保留第一個事件的倒數
  const daysToResign = computed(() => {
    if (settings.events.length === 0) return 0;
    const target = dayjs(settings.events[0].date).hour(0).minute(0).second(0);
    return target.diff(now.value, "day");
  });

  return {
    offWorkCountdown,
    offWorkProgress,
    holidayCountdown,
    holidayProgress,
    paydayCountdown,
    paydayProgress,
    eventCountdowns,
    daysToResign,
  };
}
