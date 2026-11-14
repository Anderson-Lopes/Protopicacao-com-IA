export type PageId = 'dashboard' | 'history' | 'alerts' | 'settings';
export type AlertStatus = 'active' | 'resolved';
export type HistoryPeriod = 'today' | 'week' | 'month';

export interface EnergyReading {
  label: string;
  grid: number;
  solar: number;
  total: number;
}

export interface EnergyOrigin {
  label: string;
  value: number;
  color: string;
}

export interface DashboardData {
  currentPowerKw: number;
  dailyEnergyKwh: number;
  monthlyEnergyKwh: number;
  monthChangePercent: number;
  instantLimitKw: number;
  dailyLimitKwh: number;
  lastReading: string;
  collectionIntervalMinutes: number;
  origins: EnergyOrigin[];
  readings: EnergyReading[];
}

export interface EnergyAlert {
  id: string;
  title: string;
  detail: string;
  happenedAt: string;
  status: AlertStatus;
  reason?: string;
}

export interface Equipment {
  id: string;
  name: string;
  powerKw: number;
  hoursPerDay: number;
}

export interface BusinessSettings {
  activeDays: number[];
  openingTime: string;
  closingTime: string;
  breakEnabled: boolean;
  breakStart: string;
  breakEnd: string;
  instantLimitKw: number;
  dailyLimitKwh: number;
  monthlyLimitKwh: number;
  tariffPerKwh: number;
  solarEnabled: boolean;
  solarCapacityKwp: number;
  notifications: {
    highConsumption: boolean;
    afterHours: boolean;
    monthlySummary: boolean;
  };
  equipment: Equipment[];
}

export interface HistorySummary {
  totalKwh: number;
  estimatedCost: number;
  dailyAverageKwh: number;
  peakKwh: number;
  peakLabel: string;
  solarKwh: number;
}

export interface MonitoringRepository {
  getDashboard(): DashboardData;
  getAlerts(): EnergyAlert[];
  getSettings(): BusinessSettings;
  saveSettings(settings: BusinessSettings): void;
  updateAlert(id: string, status: AlertStatus, reason?: string): EnergyAlert[];
}
