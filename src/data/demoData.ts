import type {
  BusinessSettings,
  DashboardData,
  EnergyAlert,
  EnergyReading,
  HistoryPeriod,
  HistorySummary,
} from '../domain';

const hourlyValues = [
  3.1, 2.6, 2.4, 2.2, 2.3, 2.8, 4.2, 6.8, 8.1, 8.6, 8.9, 9.4,
  9.1, 12.8, 11.4, 9.6, 8.8, 8.2, 7.9, 7.4, 6.2, 5.1, 4.2, 4.2,
];

export const demoDashboard: DashboardData = {
  currentPowerKw: 8.4,
  dailyEnergyKwh: 42.6,
  monthlyEnergyKwh: 1511.2,
  monthChangePercent: 12,
  instantLimitKw: 15,
  dailyLimitKwh: 150,
  lastReading: 'Hoje às 14h45',
  collectionIntervalMinutes: 15,
  origins: [
    { label: 'Energia da distribuidora', value: 62, color: '#62a1ff' },
    { label: 'Geração solar', value: 24, color: '#d8ef69' },
    { label: 'Autoconsumo', value: 14, color: '#a58bfa' },
    { label: 'Excedente injetado na rede', value: 4, color: '#f6b85f' },
  ],
  readings: hourlyValues.map((total, index) => ({
    label: `${String(index).padStart(2, '0')}h`,
    total,
    solar: Number((total * (index >= 7 && index <= 17 ? 0.26 : 0.04)).toFixed(1)),
    grid: Number((total * (index >= 7 && index <= 17 ? 0.74 : 0.96)).toFixed(1)),
  })),
};

export const initialAlerts: EnergyAlert[] = [
  {
    id: 'alert-high-usage',
    title: 'Consumo acima do padrão',
    detail: '12,8 kW registrados · +56% em relação à média deste horário.',
    happenedAt: 'Hoje, 14h32',
    status: 'active',
  },
  {
    id: 'alert-after-hours',
    title: 'Consumo fora do expediente',
    detail: '4,2 kW registrados fora do horário de funcionamento.',
    happenedAt: 'Ontem, 22h15',
    status: 'active',
  },
  {
    id: 'alert-peak',
    title: 'Pico de consumo identificado',
    detail: '11,6 kW registrados · +27% em relação à média.',
    happenedAt: 'Ontem, 16h40',
    status: 'resolved',
    reason: 'Equipamento de climatização revisado.',
  },
];

export const initialSettings: BusinessSettings = {
  activeDays: [1, 2, 3, 4, 5],
  openingTime: '08:00',
  closingTime: '18:00',
  breakEnabled: true,
  breakStart: '12:00',
  breakEnd: '13:00',
  instantLimitKw: 15,
  dailyLimitKwh: 150,
  monthlyLimitKwh: 3600,
  tariffPerKwh: 0.85,
  solarEnabled: true,
  solarCapacityKwp: 5,
  notifications: {
    highConsumption: true,
    afterHours: true,
    monthlySummary: false,
  },
  equipment: [
    { id: 'equipment-ac', name: 'Ar-condicionado 12.000 BTU', powerKw: 1.4, hoursPerDay: 8 },
    { id: 'equipment-freezer', name: 'Freezer horizontal', powerKw: 0.35, hoursPerDay: 24 },
    { id: 'equipment-lights', name: 'Iluminação LED (conjunto)', powerKw: 0.6, hoursPerDay: 10 },
  ],
};

const weeklyTotals = [118, 126, 121, 134, 141, 96, 58];
const weekLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function getHistoryReadings(period: HistoryPeriod): EnergyReading[] {
  if (period === 'today') return demoDashboard.readings;

  if (period === 'week') {
    return weeklyTotals.map((total, index) => ({
      label: weekLabels[index],
      total,
      solar: Number((total * 0.276).toFixed(1)),
      grid: Number((total * 0.724).toFixed(1)),
    }));
  }

  return Array.from({ length: 30 }, (_, index) => {
    const total = Math.round(76 + ((index * 17 + 31) % 42) + (index % 5) * 4);
    return {
      label: String(index + 1).padStart(2, '0'),
      total,
      solar: Number((total * (0.22 + (index % 4) * 0.015)).toFixed(1)),
      grid: Number((total * (0.78 - (index % 4) * 0.015)).toFixed(1)),
    };
  });
}

export function summarizeHistory(readings: EnergyReading[], tariff: number): HistorySummary {
  const totalKwh = readings.reduce((sum, item) => sum + item.total, 0);
  const solarKwh = readings.reduce((sum, item) => sum + item.solar, 0);
  const peak = readings.reduce(
    (current, item) => (item.total > current.total ? item : current),
    readings[0] ?? { label: '—', total: 0, grid: 0, solar: 0 },
  );

  return {
    totalKwh,
    estimatedCost: totalKwh * tariff,
    dailyAverageKwh: readings.length ? totalKwh / readings.length : 0,
    peakKwh: peak.total,
    peakLabel: peak.label,
    solarKwh,
  };
}
