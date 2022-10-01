
# TSAdminMQTT

TSAdminMQTT is an application to control and manage SmartHome devices running with [Tasmota](https://github.com/arendst/Tasmota) 

# Compiled version v1.1.2

- [Windows V1.1.2](https://www.dropbox.com/s/h02f9550oyc5kb8/TSAdminMQTT_v.1.1.2-windows-x64.zip?dl=1)
- [Linux V1.1.2](https://www.dropbox.com/s/be7i3d69iscu0hv/TSAdminMQTT_v.1.1.2-linux-x64.zip?dl=1)
- [MacOS V1.1.2](https://www.dropbox.com/s/z9o6a484vfk2j1n/TSAdminMQTT_v.1.1.2-MacOS-x64.zip?dl=1)

## Features v1.1.3

- Auto Setup for MQTT Enable, set Host, Set Topic for all devices
- Save and manage config backups
- AutoScan for Tasmota Devices
- Light/dark mode toggle
- Display Wifi strength
- Info when there is a new Fw version for the device
- Shows the version of the TS firmware of the device 
- Assign devices to room
- Manage Tasmota devices
- Includes an [MQTT broker](https://github.com/moscajs/aedes)
- Displays live power states of the device
- Data / Settings storage in an [ngx-indexed-db](https://github.com/assuncaocharles/ngx-indexed-db)
- OnScreenKeyboard for mobile devices (Can be disabled for desktop mode in the settings)[ngx-material-keyboard(https://github.com/ngx-material-keyboard)  


## Tech Stack

**Client:** [Angular](https://angular.io/) 14.1.3 with Electron v20.0.1 build for Win, Linux, MacOS 

**MQTT Broker:** [Aedes](https://github.com/moscajs/aedes)

**DataBase** [ngx-indexedDB](https://github.com/assuncaocharles/ngx-indexed-db)

**UI:** [Angular Material](https://material.angular.io/)


## Screenshot
![App Screenshot](https://i.postimg.cc/bdfyVf8L/setup5.png)

## Screenshot
![App Screenshot](https://i.postimg.cc/nVCkqjz0/setup8.png)

## Screenshot
![App Screenshot](https://i.postimg.cc/mg8zdjpM/mqttAuto.png)

## Requirements

- Angular CLI: 14.2.1
- Node: 16.10.0
- Package Manager: npm 7.24.0

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Start TSAdminMQTT development Windows

Run `npm run windows` for start TSAdminMQTT 

## Start TSAdminMQTT development linux

Run `npm run linux` for start TSAdminMQTT

## Start TSAdminMQTT development MacOS

Run `npm run macOS` for start TSAdminMQTT

## Build Windows

Run `npm run electron-package-windows` to build the project.

## Build Linux 

Run `npm run electron-package-linux` to build the project.

## MacOs

!!! Important the MacOs build must be done under a Linux operating system !!!

Run `npm run electron-package-macOS` to build the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
