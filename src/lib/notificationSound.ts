// Notification sound utilities using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export type NotificationSoundType = "success" | "alert" | "reminder" | "system";

const soundConfigs: Record<NotificationSoundType, { frequency: number; duration: number; type: OscillatorType; pattern?: number[] }> = {
  success: { frequency: 880, duration: 150, type: "sine", pattern: [1, 0.5, 1.2] },
  alert: { frequency: 440, duration: 200, type: "square", pattern: [1, 1, 1] },
  reminder: { frequency: 660, duration: 120, type: "sine", pattern: [1, 1.5] },
  system: { frequency: 520, duration: 100, type: "triangle", pattern: [1] },
};

export async function playNotificationSound(type: NotificationSoundType = "system"): Promise<void> {
  try {
    const ctx = getAudioContext();
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const config = soundConfigs[type];
    const pattern = config.pattern || [1];
    
    let startTime = ctx.currentTime;
    
    for (const multiplier of pattern) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency * multiplier, startTime);
      
      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + config.duration / 1000);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + config.duration / 1000);
      
      startTime += config.duration / 1000 + 0.05;
    }
  } catch (error) {
    console.warn("Could not play notification sound:", error);
  }
}

// Browser notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }
  
  if (Notification.permission === "granted") {
    return "granted";
  }
  
  if (Notification.permission !== "denied") {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
}

export function showBrowserNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  }
}

// Check if sounds are enabled (stored in localStorage)
const SOUND_ENABLED_KEY = "sequelstring_notification_sound";

export function isSoundEnabled(): boolean {
  const stored = localStorage.getItem(SOUND_ENABLED_KEY);
  return stored !== "false"; // Default to true
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
}
