export interface Activity {
  id: string;
  title: string;
  image: string | null;
  avatarColor: string;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  email: string;
  profileImage: string | null;
  avatarColor: string;
  statusMessage: string;
  weeklyActivityPercent: number;
  weeklyActivityMessage: string;
  health: { steps: number };
  sleep: { hours: number };
  activitySummary: Activity[];
}

export interface Member {
  avatarUrl: string | null;
}

export interface GroupActivity {
  id: string;
  type: 'notice' | 'comment' | 'schedule';
  message: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  thumbnailColor: string; // 'yellow' | 'pink' | 'blue' | 'green' | 'cream' | 'gray'
  icon: string | null;
  isFavorite: boolean;
  profileImage?: string | null;
  members: Member[];
  createdAt: string;
  recentActivities: GroupActivity[];
  joinLink?: string;
}

export interface Friend {
  id: string;
  name: string;
  profileImage: string | null;
  avatarColor: string;
  statusMessage: string;
  isNew: boolean;
}

export interface PopularCategory {
  id: string;
  name: string;
  color: string;
}

export interface GroupPurposeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface WizardStep {
  totalSteps: number;
  currentStep: number;
  title: string;
}

export interface TrafficPoint {
  time: string;
  value: number;
}

export interface ParticipationStats {
  rate: number;
  rangeLabel: string;
  points: TrafficPoint[];
  peakTime: string;
}

export interface Settlement {
  id: string;
  title: string;
  thumbnail: string | null;
  emoji: string | null;
  status: 'done' | 'pending';
  date: string;
  category: string;
  amount: number;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  language: string;
  appVersion: string;
}

export interface PayoutAccount {
  bankName: string;
  accountNumberMasked: string;
  holderName: string;
}

export interface OptionMenuItem {
  key: string;
  label: string;
  sublabel?: string;
  icon: string;
  color: string;
  type: 'link' | 'toggle' | 'select' | 'action';
  standalone?: boolean;
}

export interface OptionMenuSection {
  label: string;
  items: OptionMenuItem[];
}

export interface Moment {
  id: string;
  title: string;
  date: string;
  year: string;
  image: string | null;
  thumbnailColor: string;
  isFavorite: boolean;
}

export interface NotificationItem {
  id: string;
  type: string;
  icon: string;
  title: string;
  message: string;
  timeAgo?: string;
  timestamp?: string;
  isRead: boolean;
  targetUrl: string;
  avatar?: string;
  badgeColor?: string;
}
