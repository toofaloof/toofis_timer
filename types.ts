
export enum TimerMode {
  IDLE = 'idle',
  LEARN = 'learn',
  BREAK = 'break',
}

export interface Session {
  id: string;
  type: TimerMode.LEARN | TimerMode.BREAK;
  duration: number; // in seconds
  label?: string;
  note?: string;
  completedAt: string; // ISO string
}
