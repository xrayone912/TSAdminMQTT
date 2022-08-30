
# TSAdminMQTT

TSAdminMQTT is an application to control and manage SmartHome devices running with [Tasmota](https://github.com/arendst/Tasmota) 

# Compiled version v1.0.4

- [Windows V1.0.4](https://www.dropbox.com/s/2gd4g0g0cpz70re/TSAdminMQTT_v.1.0.4-win32-x64.zip?dl=1)
- [Linux V1.0.4](https://www.dropbox.com/s/jjf8ymix44lyhw8/TSAdminMQTT_v.1.0.4-linux-x64.zip?dl=1)
- [MacOS V1.0.4](https://www.dropbox.com/s/ugi1u7yv2627hlp/TSAdminMQTT_v.1.0.4-MacOS.zip?dl=1)

## Features

- Light/dark mode toggle
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

![App Screenshot](https://i.postimg.cc/02qz0BZb/Screenshot-2022-08-24-094030.png)

## Requirements

- Angular CLI: 14.2.1
- Node: 16.10.0
- Package Manager: npm 7.24.0

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Start TSAdminMQTT development

Run `npm start` for start TSAdminMQTT 

## Build Windows

Run `npm run electron-package-windows` to build the project.

## Build Linux 

Run `npm run electron-package-linux` to build the project.

## MacOs

!!! Important the MacOs build must be done under a Linux operating system !!!

Run `npm run electron-package-macOS` to build the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
