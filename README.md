
# TSAdminMQTT

TSAdminMQTT is an application to control and manage SmartHome devices running with [Tasmota](https://github.com/arendst/Tasmota) 

# Compiled version v1.0.7

- [Windows V1.0.7](https://www.dropbox.com/s/bn4dz17e7lr7sfy/TSAdminMQTT_v.1.0.7-windows-x64.zip?dl=1)
- [Linux V1.0.7](https://www.dropbox.com/s/bgbrk0z32ixkpvm/TSAdminMQTT_v.1.0.7-linux-x64.zip?dl=1)

# Compiled version v1.0.6

- [MacOS V1.0.6](https://www.dropbox.com/s/ak546k1c8pkkm9b/TSAdminMQTT_v.1.0.6-darwin-x64.zip?dl=1)

## Features

- Auto Setup for MQTT Enable, set Host, Set Topic for all devices
- Save and manage config backups
- AutoScan for Tasmota Devices
- Light/dark mode toggle
- Display Wifi strength
- Shows the version of the TS firmware of the device 
- Assign devices to room
- Manage Tasmota devices
- Includes an [MQTT broker](https://github.com/moscajs/aedes)
- Displays live power states of the device
- Data / Settings storage in an [ngx-indexed-db](https://github.com/assuncaocharles/ngx-indexed-db)


## Tech Stack

**Client:** [Angular](https://angular.io/) 14.1.3 with Electron v20.0.1 build for Win, Linux, MacOS 

**MQTT Broker:** [Aedes](https://github.com/moscajs/aedes)

**DataBase** [ngx-indexedDB](https://github.com/assuncaocharles/ngx-indexed-db)

**UI:** [Angular Material](https://material.angular.io/)


## Screenshot

![App Screenshot]([https://i.postimg.cc/02qz0BZb/Screenshot-2022-08-24-094030.png](https://i.postimg.cc/Qdh0hMTd/Screenshot-2022-09-01-170623.png))

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
