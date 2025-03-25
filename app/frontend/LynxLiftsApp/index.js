/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { MAPS_API_KEY } from '@env';
import { NativeModules } from 'react-native';

// Pass API key to iOS
if (NativeModules.Settings) {
    NativeModules.Settings.set({ GoogleMapsAPIKey: MAPS_API_KEY });
  }

AppRegistry.registerComponent(appName, () => App);
