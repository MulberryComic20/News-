import { BrowserWindow } from 'electron';
import path from 'path';

export const showDesktopSettings = () => {
  if (WindowManager.getAll('settings').length > 0) {
    WindowManager.getAll('settings')[0].show();
    return;
  }
  const desktopSettings = new BrowserWindow({
    width: 800,
    height: 540,
    autoHideMenuBar: true,
    frame: Settings.get('nativeFrame'),
    show: false,
    nodeIntegration: true,
    icon: path.resolve(`${__dirname}/../../../assets/img/main.png`),
    title: 'Settings',
  });
  desktopSettings.loadURL(`file://${__dirname}/../../../public_html/desktop_settings.html`);

  WindowManager.add(desktopSettings, 'settings');
  WindowManager.forceFocus(desktopSettings);
};

Emitter.on('window:settings', () => {
  // const mainWindow = WindowManager.getAll('main')[0];
  showDesktopSettings();
});

Emitter.on('settings:set', (event, details) => {
  Settings.set(details.key, details.value);
  // DEV: React to settings change
  switch (details.key) {
    case 'miniAlwaysShowSongInfo':
      Emitter.sendToGooglePlayMusic('miniAlwaysShowSongInfo', { state: details.value });
      break;
    case 'miniAlwaysOnTop':
      Emitter.sendToGooglePlayMusic('miniAlwaysOnTop', { state: details.value });
      break;
    case 'speechRecognition':
      Emitter.sendToGooglePlayMusic('speech:toggle', { state: details.value });
      break;
    default:
      break;
  }
});
