import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  RemoteConfig,
  getRemoteConfig,
  fetchAndActivate,
  getBoolean,
} from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private app: FirebaseApp;
  private remoteConfig: RemoteConfig;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.remoteConfig = getRemoteConfig(this.app);

    this.remoteConfig.settings.minimumFetchIntervalMillis = 10000;

    this.remoteConfig.defaultConfig = {
      show_categories: true,
    };
  }

  async init(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.error(
        'No se pudo obtener la configuración remota, se usan los valores por defecto.',
        error,
      );
    }
  }

  isCategoriesEnabled(): boolean {
    return getBoolean(this.remoteConfig, 'show_categories');
  }
}
