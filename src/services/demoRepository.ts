import {
  demoDashboard,
  initialAlerts,
  initialSettings,
} from '../data/demoData';
import type {
  AlertStatus,
  BusinessSettings,
  DashboardData,
  EnergyAlert,
  MonitoringRepository,
} from '../domain';

const storageKey = 'energia-clara-demo-v1';

interface DemoState {
  alerts: EnergyAlert[];
  settings: BusinessSettings;
}

export class DemoRepository implements MonitoringRepository {
  getDashboard(): DashboardData {
    return demoDashboard;
  }

  getAlerts(): EnergyAlert[] {
    return this.readState().alerts;
  }

  getSettings(): BusinessSettings {
    return this.readState().settings;
  }

  saveSettings(settings: BusinessSettings): void {
    const state = this.readState();
    this.writeState({ ...state, settings });
  }

  updateAlert(id: string, status: AlertStatus, reason?: string): EnergyAlert[] {
    const state = this.readState();
    const alertExists = state.alerts.some((alert) => alert.id === id);
    if (!alertExists) throw new Error('O alerta selecionado não foi encontrado.');

    const alerts = state.alerts.map((alert) =>
      alert.id === id ? { ...alert, status, reason } : alert,
    );
    this.writeState({ ...state, alerts });
    return alerts;
  }

  private readState(): DemoState {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      const state = { alerts: initialAlerts, settings: initialSettings };
      this.writeState(state);
      return state;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<DemoState>;
      if (!Array.isArray(parsed.alerts) || !parsed.settings) {
        throw new Error('formato de dados inválido');
      }
      return parsed as DemoState;
    } catch (error) {
      throw new Error(
        'Não foi possível ler os dados de demonstração salvos neste navegador. Limpe os dados do site e tente novamente.',
        { cause: error },
      );
    }
  }

  private writeState(state: DemoState): void {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }
}
