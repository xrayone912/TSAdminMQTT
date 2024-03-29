
# TSAdminMQTT

TSAdminMQTT is an application to control and manage SmartHome devices running with [Tasmota](https://github.com/arendst/Tasmota) 

# Compiled desktop version v1.1.6

- [Windows V1.1.6](https://www.dropbox.com/s/thubiu82jrimhaq/TSAdminMQTT_v1.1.6-windows.zip?dl=1)
- [Linux V1.1.6](https://www.dropbox.com/s/k6056ev6j80dnq1/TSAdminMQTT_v1.1.6-Linux.zip?dl=1)
- [MacOS V1.1.6](https://www.dropbox.com/s/rvadyier5afe4nb/TSAdminMQTT_v1.1.6-MacOS.zip?dl=1)

# Compiled Raspberry PI 3b version v1.1.6

This build is for 5 inch displays with a resolution of 800x400. The display must be used in horizontal mode.

- [Pi 3b armV7 V1.1.6](https://www.dropbox.com/s/p2vd4hddfa0taan/TSAdminMQTT_v1.1.6-armv7l.zip?dl=1)

## Features v1.1.6

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
- Displays live power states of the tasmota device
- Data / Settings storage in an [ngx-indexed-db](https://github.com/assuncaocharles/ngx-indexed-db)
- OnScreenKeyboard for mobile devices (Can be disabled for desktop mode in the settings) [ngx-material-keyboard](https://github.com/ngx-material-keyboard)
- Display size detection for mobile view (Raspberry PI with 5 inch display 800x480)


## Tech Stack

**Client:** [Angular](https://angular.io/) 14.1.3 with Electron v20.0.1 build for Win, Linux, MacOS, arm7l (Raspberry PI) [Beta] 

**MQTT Broker:** [Aedes](https://github.com/moscajs/aedes)

**DataBase** [ngx-indexedDB](https://github.com/assuncaocharles/ngx-indexed-db)

**UI:** [Angular Material](https://material.angular.io/)


## Setup step 1 (Set rooms)
![App Screenshot](https://i.postimg.cc/KYK7MfTj/1.png)

## Setup step 2 (Assign adapter to room)
![App Screenshot](https://i.postimg.cc/MKTnHTVK/2.png)

## Setup step 3 (Set credentials for adapter if exist)
![App Screenshot](https://i.postimg.cc/zBxJYCdw/3.png)

## Setup step 4 (Enable MQTT for all adapter)
![App Screenshot](https://i.postimg.cc/mggJKvvn/4.png)

## Setup step 5 (Set MQTT Host for all adapter)
![App Screenshot](https://i.postimg.cc/VvFZVgD1/5.png)

## Setup step 6 (Set MQTT Topic for all adapter)
![App Screenshot](https://i.postimg.cc/sDw0PnM4/6.png)

## Setup step 7 (Finish setup)
![App Screenshot](https://i.postimg.cc/Y0tbYgkP/7.png)

## Screenshot
![App Screenshot](https://i.postimg.cc/ydjFqG4f/8.png)

## Screenshot
![App Screenshot](https://i.postimg.cc/0Nmf4Zy3/9.png)


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

## Start TSAdminMQTT development arm7l (Raspberry PI 3+)

Run `npm run arm7l` for start TSAdminMQTT

## Build Windows

Run `npm run electron-package-windows` to build the project.

## Build Linux 

Run `npm run electron-package-linux` to build the project.

## MacOS

!!! Important the MacOs build must be done under a Linux operating system !!!

Run `npm run electron-package-macOS` to build the project.

## Build arm7l (Raspberry PI 3+)

Before build the display size of the used display must be set in the app.json width: height and frame: false
in the enviroment.arm7l the variable screenSize must be set to your display width.
And in the Pi config the display must be set to horizontal.

Run `npm run electron-package-arm7l` to build the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
