const {app, BrowserWindow} = require('electron')
    const url = require("url");
    const path = require("path");
    const {ipcMain} = require('electron');
    const ip = require('ip');

    let mainWindow

    function createWindow () {
        app.mqtt = require(path.join(__dirname, '/src/app/Services/mqtt/mqtt.js'))();
      mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: __dirname + '/src/favicon.ico',
        autoHideMenuBar: true,
        useContentSize: true,
        maximizable: false,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webSecurity : false,
          disableBlinkFeatures: "BlockCredentialedSubresources",
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/tsadminmqtt/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      //mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    ipcMain.on('restart', (event, data, webContents) => {
      event.preventDefault();
      app.exit();
      app.relaunch();
    });

    ipcMain.handle('getIp', () => {
    return ip.address();
    });

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })