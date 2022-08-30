
# TSAdminMQTT

TSAdminMQTT is an application to control and manage SmartHome devices running with Tasmota


## Features

- Light/dark mode toggle
- Assign devices to room
- Manage Tasmota devices
- Includes an MQTT broker
- Displays live power states of the device 


## Tech Stack

**Client:** Angular 14.1.1 with Electron v20.0.1 build for Win, Linux, Mac 

**MQTT Broker:** Aedes https://github.com/moscajs/aedes

**NGX-Indexed-DB:** https://github.com/assuncaocharles/ngx-indexed-db

**UI:** Angular Material  https://material.angular.io/


## Screenshot

![App Screenshot](https://i.postimg.cc/02qz0BZb/Screenshot-2022-08-24-094030.png)


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Start TSAdminMQTT development

Run `npm start` for start TSAdminMQTT 

## Build

Run `npm run electron-package-win` to build the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
