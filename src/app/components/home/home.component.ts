import { Component, OnInit } from '@angular/core';
import { DeviceStorage, global } from '../../models/devices';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Room_Array } from 'src/app/models/rooms';
import { HttpService } from '../../services/http.service';
import { SettingsComponent } from '../settings/settings.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { IpcRenderer } from 'electron';
import { MatDialog } from '@angular/material/dialog';
import { TutorialComponent } from '../dialog/tutorial/tutorial.component';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ResetSettingsComponent } from '../dialog/resetSettings/resetSettings.component';
import { TsConsoleComponent } from '../tsConsole/tsConsole.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public message!: string;
  public package!: any;
  public ScreenKeyboard = new FormControl(true);
  public darkTheme = new FormControl(true);
  public fwInfo = new FormControl(true);
  public ipc: IpcRenderer | undefined;
  private errorCode!: number;
  public appVersion = environment.appVersion;
  public backupFiles: string[] = [];
  public localIp = '';
  public infoFw!: string;
  public fwInfoToggle = true;
  public panelOpenState = false;
  public onScreenKeyboard = true;
  private subs = new SubSink();

  constructor(
    public deviceStorage: DeviceStorage,
    private dbService: NgxIndexedDBService,
    private router: Router,
    public global: global,
    public roomsArray: Room_Array,
    public httpService: HttpService,
    public _bottomSheet: MatBottomSheet,
    private _mqttService: MqttService,
    private ThemeService: ThemeService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    //Switch Darkmode / Lightmode
    this.darkTheme.valueChanges.subscribe((value) => {
      return value
        ? this.ThemeService.toggleDark()
        : this.ThemeService.toggleLight();
    });
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
    }
  }

  ngOnInit() {
   this.subs.sink = this.dbService.getAll('adpater').subscribe((adapter: any[]) => {
      if (adapter.length === 0) {
        this.router.navigate(['/setup']);
      }

      this.deviceStorage.Devices = adapter;
    });

    this.subs.sink = this.dbService.getByKey('darkmode', 1).subscribe((darkMode: any) => {
      if (darkMode !== undefined) {
        this.global.darkMode = darkMode.darkmode;
      } else {
        this.global.darkMode = true;
      }
    });

    this.subs.sink = this.dbService
      .getByKey('onScreenKeyboard', 1)
      .subscribe((onScreenKeyboard: any) => {
        if (onScreenKeyboard !== undefined) {
          this.global.onScreenKeyboard = onScreenKeyboard;
        } else {
          this.global.onScreenKeyboard = true;
        }
      });

      this.subs.sink = this.dbService.getByKey('fwinfo', 1).subscribe((fwinfo: any) => {
      if (fwinfo !== undefined) {
        this.fwInfoToggle = fwinfo.fwinfo;
      } else {
        this.fwInfoToggle = true;
      }
    });

    this.getLocalIp();

    this._mqttService.connect();

    this.watchMqttStates();

    this.getDeviceStatus();

    this.checkTsFwUpdate();
  }

  public watchMqttStates() {
    this.subs.sink = this._mqttService
      .observe('#')
      .subscribe((message: IMqttMessage) => {
        var isValidJSON = true;
        try {
          JSON.parse(message.payload.toString());
        } catch {
          isValidJSON = false;
        }

        this.message = message.payload.toString();
        this.package = message.topic;

        var r = this.package.match(/(?<=[\/]).*(?=[\/])/g);

        var findDeviceById = this.deviceStorage.Devices.filter(
          (x) => x.ip === r[0]
        );

        if (isValidJSON) {
          var json = JSON.parse(message.payload.toString());

          try {
            if (json[environment.StatusFWR].Version !== undefined) {
              this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
                x.ip === r[0]
                  ? {
                      ...x,
                      sw: json[environment.StatusFWR].Version.replace(
                        / *\([^)]*\) */g,
                        ''
                      )
                    }
                  : x
              );
              var filteredDevices = this.deviceStorage.Devices.filter(
                (x) => x.ip === r[0]
              );
              setTimeout(() => {
                if (filteredDevices[0].sw.localeCompare(this.infoFw)) {
                  this.deviceStorage.Devices = this.deviceStorage.Devices.map(
                    (x) =>
                      x.ip === r[0]
                        ? {
                            ...x,
                            isFwUpdate: true
                          }
                        : x
                  );
                } else {
                  this.deviceStorage.Devices = this.deviceStorage.Devices.map(
                    (x) =>
                      x.ip === r[0]
                        ? {
                            ...x,
                            isFwUpdate: false
                          }
                        : x
                  );
                }
              }, 1500);
            }
          } catch (error) {}

          try {
            if (json[environment.Status].Power !== undefined) {
              this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
                x.ip === r[0]
                  ? { ...x, Power: json[environment.Status].Power }
                  : x
              );
            }
          } catch (error) {}
        }

        try {
          if (
            json[environment.StatusSTS][environment.WIFI].RSSI !== undefined
          ) {
            this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
              x.ip === r[0]
                ? {
                    ...x,
                    wifiSingnal:
                      json[environment.StatusSTS][environment.WIFI].RSSI
                  }
                : x
            );
          }
        } catch (error) {}

        if (findDeviceById.length > 0) {
          switch (this.message) {
            case 'ON':
              if (findDeviceById[0].Power !== 1) {
                this.deviceStorage.Devices = this.deviceStorage.Devices.map(
                  (x) => (x.ip === r[0] ? { ...x, Power: 1 } : x)
                );
              }

              break;
            case 'OFF':
              if (findDeviceById[0].Power !== 0) {
                this.deviceStorage.Devices = this.deviceStorage.Devices.map(
                  (x) => (x.ip === r[0] ? { ...x, Power: 0 } : x)
                );
              }
              break;
            default:
              break;
          }
        }
      });
  }

  public getDeviceStatus() {
    this.subs.sink = this.dbService.getAll('adpater').subscribe((adapter: any[]) => {
      adapter.forEach((element) => {
        this.subs.sink = this._mqttService
          .publish(
            environment.cmnd + element.ip + environment.cmndstatus,
            environment.cmndFlagZero,
            {
              qos: 1,
              retain: true
            }
          )
          .subscribe((message: any) => {});
      });
    });
  }

  public wifiSignalStrengthCalc(signal: number) {
    if (signal >= 66) {
      return 1;
    }
    if (signal >= 40 && signal <= 65) {
      return 2;
    }
    if (signal >= 25 && signal <= 39) {
      return 3;
    }
    if (signal <= 25) {
      return 4;
    }

    return null;
  }

  public openBottomSheet(ip: any, userName: string, password: string): void {
    this.global.ip = ip;
    this.global.userName = userName;
    this.global.password = password;

    this.tsAdapterLogin();

    setTimeout(() => {
      if (this.errorCode !== 401) {
        this._bottomSheet.open(SettingsComponent);
      }
    }, 500);
  }

  public openTsConsole(ip: any, userName: string, password: string) {
    this.global.ip = ip;
    this.global.userName = userName;
    this.global.password = password;

    this.tsAdapterLogin();

    setTimeout(() => {
      if (this.errorCode !== 401) {
        this._bottomSheet.open(TsConsoleComponent);
      }
    }, 500);
  }

  public tsAdapterLogin() {
    // Workaround Bypass blocking of subresource requests whose URLs contain embedded credentials
    // First url call set credentials secend call (SettingsComponent call the adapter URL)
    this.subs.sink = this.httpService
      .login(this.global.ip, this.global.userName, this.global.password)
      .subscribe({
        error: (error) => {
          if (error.status === 401) {
            this.errorCode = error.status;
            this.toastr.error(environment.toastr401, '', {
              closeButton: true,
              timeOut: 4000,
              progressBar: true,
              enableHtml: true
            });
          } else {
            this.errorCode = error.status;
          }
        }
      });
  }

  public DevicePowerOn(ip: string, power: number): void {
    if (power === 0) {
      this.subs.sink = this._mqttService
        .publish(
          environment.cmnd + ip + environment.cmndPower,
          environment.cmndFlagOne,
          {
            qos: 1,
            retain: true
          }
        )
        .subscribe((message: any) => {});
    } else {
      this.subs.sink = this._mqttService
        .publish(
          environment.cmnd + ip + environment.cmndPower,
          environment.cmndFlagZero,
          {
            qos: 1,
            retain: true
          }
        )
        .subscribe((message: any) => {});
    }
  }

  public openTutorialDialog() {
    const dialogRef = this.dialog.open(TutorialComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openResetDialog() {
    const dialogRef = this.dialog.open(ResetSettingsComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public deleteBackupFile(fileName: string, ip: string) {
    this.ipc?.send('deleteFile', fileName, environment.deletePathBackupFolder);
    this.ipc?.on('deleted', (event) => {
      this.readBackupFolder(ip);
      this.fileDeleted();
    });
  }

  public readBackupFolder(ip: string) {
    this.backupFiles = [];
    this.ipc?.send('readFiles', environment.readPathBackupFolder);
    this.ipc?.on('files', (event, files: string[]) => {
      this.backupFiles = [];
      files.forEach((element) => {
        if (element.includes(ip)) {
          this.backupFiles.push(element);
        }
      });
    });
  }

  public backup(ip: string) {
    const newURL = environment.httpBaseUrl + ip + environment.suffixDL;
    this.ipc?.send(
      'download-button',
      {
        url: newURL
      },
      ip,
      environment.readPathBackupFolder,
      environment.fileExtension
    );
    this.ipc?.on('download-success', (event, arg, base) => {
      this.showBackupSuccess(base);
    });
  }

  public openExternalUrl() {
    this.ipc?.send('openUrl');
  }

  public getLocalIp() {
    (async () => {
      this.localIp = await this.ipc?.invoke('getIp');
    })();
  }

  public saveGlobal() {
    const data = {
      darkMode: !this.darkTheme.value
    };
    this.subs.sink = this.dbService.getByKey('darkmode', 1).subscribe((darkMode) => {
      if (darkMode !== null) {
        this.dbService
          .update('darkmode', {
            id: 1,
            darkmode: data.darkMode
          })
          .subscribe((storeData) => {});
      } else {
        this.subs.sink = this.dbService
          .add('darkmode', {
            darkmode: data.darkMode
          })
          .subscribe((storeData) => {});
      }
    });
  }

  public saveOnScreenKeyboard() {
    const data = {
      onScreenKeyboard: !this.onScreenKeyboard
    };
    this.subs.sink = this.dbService
      .getByKey('onScreenKeyboard', 1)
      .subscribe((onScreenKeyboard) => {
        if (onScreenKeyboard !== null) {
          this.dbService
            .update('onScreenKeyboard', {
              id: 1,
              onScreenKeyboard: data.onScreenKeyboard
            })
            .subscribe((storeData) => {});
        } else {
          this.subs.sink = this.dbService
            .add('onScreenKeyboard', {
              onScreenKeyboard: data.onScreenKeyboard
            })
            .subscribe((storeData) => {});
        }
      });
    this.global.onScreenKeyboard = data.onScreenKeyboard;
  }

  public setShowFwUpdateInfo() {
    const data = {
      fwinfo: !this.fwInfoToggle
    };
    this.subs.sink = this.dbService.getByKey('fwinfo', 1).subscribe((fwinfo) => {
      if (fwinfo !== null) {
        this.dbService
          .update('fwinfo', {
            id: 1,
            fwinfo: data.fwinfo
          })
          .subscribe((storeData) => {});
      } else {
        this.subs.sink = this.dbService
          .add('fwinfo', {
            fwinfo: !data.fwinfo
          })
          .subscribe((storeData) => {});
      }
    });
  }

  public checkTsFwUpdate() {
    this.subs.sink = this.httpService.checkTsFwUpdate().subscribe((result) => {
      this.infoFw = result.name.replace(/[^\d.-]/g, '');
    });
  }

  public disableFwInfo(ip: string) {
    this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
      x.ip === ip
        ? {
            ...x,
            isFwUpdate: false
          }
        : x
    );
  }

  public showBackupSuccess(basePath: string) {
    this.toastr.success(
      environment.toastrSuccessDL + basePath + environment.readPathBackupFolder,
      '',
      {
        closeButton: environment.toastrcloseButton,
        timeOut: environment.toastrTimeOut,
        progressBar: environment.toastrProgressBar,
        enableHtml: true
      }
    );
  }

  public fileDeleted() {
    this.toastr.success(environment.toastrDeleteDL, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar,
      enableHtml: true
    });
  }
}
