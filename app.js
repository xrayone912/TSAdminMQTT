const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const { ipcMain } = require('electron');
const ip = require('ip');
const { download } = require('electron-dl');
const fs = require('fs');

let mainWindow;

function createWindow() {
  app.mqtt = require(path.join(__dirname, '/src/app/services/mqtt/mqtt.js'))();
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    icon: __dirname + '/src/favicon.ico',
    autoHideMenuBar: true,
    useContentSize: true,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      disableBlinkFeatures: 'BlockCredentialedSubresources'
    }
  });

  // Open the DevTools.
   mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/tsadminmqtt/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

ipcMain.on('restart', (event, data, webContents) => {
  event.preventDefault();
  app.exit();
  app.relaunch();
});

ipcMain.on('readFiles', (event, data, webContents) => {
  var basepath = app.getAppPath();
  basepath = basepath.replace('app.asar', '');
  fs.readdir(basepath + '\\BackupConf', (err, files) => {
    event.sender.send('files', files);
  });
});

ipcMain.on('deleteFile', (event, data, webContents) => {
  var basepath = app.getAppPath();
  basepath = basepath.replace('app.asar', '');
  fs.unlinkSync(basepath + '\\BackupConf\\' + data, (err, files) => {});
  event.sender.send('deleted');
});

ipcMain.on('download-button', async (event, { url }, ip) => {
  var basepath = app.getAppPath();
  var todayDate = new Date().toISOString().slice(0, 10);
  const win = BrowserWindow.getFocusedWindow();
  basepath = basepath.replace('app.asar', '');
  event.sender.send('download-success', url, basepath);
  await download(win, url, {
    directory: basepath + '\\BackupConf',
    filename: ip + '_' + todayDate + '.dmp'
  });
});

ipcMain.handle('getIp', () => {
  return ip.address();
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
