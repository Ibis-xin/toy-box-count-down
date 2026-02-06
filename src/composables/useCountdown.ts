import dayjs from "dayjs";
import { computed, onMounted, onUnmounted, ref } from "vue";

export function useCountdown() {
  const now = ref(dayjs());
  let timer: number;

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = dayjs();
    }, 1000);
  });

  onUnmounted(() => clearInterval(timer));

  /** 距離下班剩餘時間 */
  const offWorkCountdown = computed(() => {
    const target = dayjs().hour(17).minute(30).second(0);
    const diff = target.diff(now.value, "second");

    if (diff <= 0) return "已下班囉！";

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h}h ${m}m ${s}s`;
  });

  /** 下班進度百分比 (08:30 - 17:30) */
  const offWorkProgress = computed(() => {
    const start = dayjs().hour(8).minute(30).second(0);
    const end = dayjs().hour(17).minute(30).second(0);

    const total = end.diff(start, "second");
    const current = now.value.diff(start, "second");

    if (current <= 0) return 0;
    if (current >= total) return 100;
    return Math.floor((current / total) * 100);
  });

  /** 距離週六放假 */
  const holidayCountdown = computed(() => {
    const saturday = dayjs().day(5).hour(17).minute(30).second(0);

    const diff = saturday.diff(now.value, "day");
    const diff2 = saturday.diff(now.value, "hour");

    return diff > -1 ? (diff > 0 ? `${diff} 天` : `${diff2} 小時`) : "假期中";
  });

  /** 本週放假進度百分比 (週一 08:30 - 週五 17:30) */
  const holidayProgress = computed(() => {
    const start = dayjs().day(1).hour(8).minute(30).second(0);
    const end = dayjs().day(5).hour(17).minute(30).second(0);

    const total = end.diff(start, "second");
    const current = now.value.diff(start, "second");

    if (current <= 0) return 0;
    if (current >= total) return 100;
    return Math.floor((current / total) * 100);
  });

  /** 距離發薪日 */
  const paydayCountdown = computed(() => {
    let payday = dayjs().date(5).hour(0).minute(0).second(0);
    if (now.value.isAfter(payday)) {
      payday = payday.add(1, "month");
    }
    const diff = payday.diff(now.value, "day");
    return `${diff} 天`;
  });

  /** 發薪日進度百分比 (從上個月 5 號到這個月 5 號) */
  const paydayProgress = computed(() => {
    let end = dayjs().date(5).hour(0).minute(0).second(0);
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

  /** 距離離職剩幾天 */
  const daysToResign = computed(() => {
    const resignDate = dayjs("2028-01-15");
    return resignDate.diff(now.value, "day");
  });

  return {
    offWorkCountdown,
    offWorkProgress,
    holidayCountdown,
    holidayProgress,
    paydayCountdown,
    paydayProgress,
    daysToResign,
  };
}
