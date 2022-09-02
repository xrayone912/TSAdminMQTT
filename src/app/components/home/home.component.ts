import { Component, OnInit } from '@angular/core';
import { DeviceStorage, Devices, global } from '../../models/devices';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Room_Array } from 'src/app/models/rooms';
import { HttpService } from '../../services/http.service';
import { SettingsComponent } from '../settings/settings.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { IpcRenderer } from 'electron';
import { MatDialog } from '@angular/material/dialog';
import { TutorialComponent } from '../dialog/tutorial/tutorial.component';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ResetSettingsComponent } from '../dialog/resetSettings/resetSettings.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private subscription!: Subscription;
  public message!: string;
  public package!: any;
  darkTheme = new FormControl(true);
  public ipc: IpcRenderer | undefined;
  private errorCode!: number;
  public appVersion = environment.appVersion;
  public backupFiles: string[] = [];

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
    this.dbService.getAll('adpater').subscribe((adapter: any[]) => {
      if (adapter.length === 0) {
        this.router.navigate(['/setup']);
      }

      this.deviceStorage.Devices = adapter;
    });

    this.dbService.getByKey('darkmode', 1).subscribe((darkMode: any) => {
      if (darkMode !== undefined) {
        this.global.darkMode = darkMode.darkmode;
      } else {
        this.global.darkMode = true;
      }
    });

    this._mqttService.connect();

    this.watchMqttStates();

    this.getDeviceStatus();
  }

  watchMqttStates() {
    this.subscription = this._mqttService
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
            if (json['StatusFWR'].Version !== undefined) {
              this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
                x.ip === r[0]
                  ? {
                      ...x,
                      sw: json['StatusFWR'].Version.replace(
                        / *\([^)]*\) */g,
                        ''
                      )
                    }
                  : x
              );
            }
          } catch (error) {}

          try {
            if (json['Status'].Power !== undefined) {
              this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
                x.ip === r[0] ? { ...x, Power: json['Status'].Power } : x
              );
            }
          } catch (error) {}
        }

        try {
          if (json['StatusSTS']['Wifi'].RSSI !== undefined) {
            this.deviceStorage.Devices = this.deviceStorage.Devices.map((x) =>
              x.ip === r[0]
                ? { ...x, wifiSingnal: json['StatusSTS']['Wifi'].RSSI }
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

  getDeviceStatus() {
    this.dbService.getAll('adpater').subscribe((adapter: any[]) => {
      adapter.forEach((element) => {
        this._mqttService
          .publish('cmnd/' + element.ip + '/STATUS', '0', {
            qos: 1,
            retain: true
          })
          .subscribe((message: any) => {});
      });
    });
  }

  wifiSignalStrengthCalc(signal: number) {
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

  openBottomSheet(ip: any, userName: string, password: string): void {
    this.global.ip = ip;
    this.global.userName = userName;
    this.global.password = password;

    // Workaround Bypass blocking of subresource requests whose URLs contain embedded credentials
    // First url call set credentials secend call (SettingsComponent call the adapter URL)
    this.httpService
      .login(this.global.ip, this.global.userName, this.global.password)
      .subscribe({
        error: (error) => {
          if (error.status === 401) {
            this.errorCode = error.status;
            this.toastr.error(
              'Unauthorized access 401 </br> No or wrong credentials </br> for this adapter',
              '',
              {
                closeButton: true,
                timeOut: 4000,
                progressBar: true,
                enableHtml: true
              }
            );
          } else {
            this.errorCode = error.status;
          }
        }
      });

    setTimeout(() => {
      if (this.errorCode !== 401) {
        this._bottomSheet.open(SettingsComponent);
      }
    }, 500);
  }

  DevicePowerOn(ip: string, power: number): void {
    if (power === 0) {
      this._mqttService
        .publish('cmnd/' + ip + '/POWER', '1', {
          qos: 1,
          retain: true
        })
        .subscribe((message: any) => {});
    } else {
      this._mqttService
        .publish('cmnd/' + ip + '/POWER', '0', {
          qos: 1,
          retain: true
        })
        .subscribe((message: any) => {});
    }
  }

  openTutorialDialog() {
    const dialogRef = this.dialog.open(TutorialComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openResetDialog() {
    const dialogRef = this.dialog.open(ResetSettingsComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteBackupFile(fileName: string, ip: string) {
    this.ipc?.send('deleteFile', fileName);
    this.ipc?.on('deleted', (event) => {
      this.readBackupFolder(ip);
      this.fileDeleted();
    });
  }

  readBackupFolder(ip: string) {
    this.backupFiles = [];
    this.ipc?.send('readFiles');
    this.ipc?.on('files', (event, files: string[]) => {
      this.backupFiles = [];
      files.forEach((element) => {
        if (element.includes(ip)) {
          this.backupFiles.push(element);
        }
      });
    });
  }

  backup(ip: string) {
    const baseUrl = 'http://';
    const newURL = baseUrl + ip + '/dl';
    this.ipc?.send(
      'download-button',
      {
        url: newURL
      },
      ip
    );
    this.ipc?.on('download-success', (event, arg, base) => {
      this.showBackupSuccess(base);
    });
  }

  saveGlobal() {
    const data = {
      darkMode: !this.darkTheme.value
    };

    this.dbService.getByKey('darkmode', 1).subscribe((darkMode) => {
      if (darkMode !== null) {
        this.dbService
          .update('darkmode', {
            id: 1,
            darkmode: data.darkMode
          })
          .subscribe((storeData) => {});
      } else {
        this.dbService
          .add('darkmode', {
            darkmode: data.darkMode
          })
          .subscribe((storeData) => {});
      }
    });
  }

  showBackupSuccess(basePath: string) {
    this.toastr.success(
      'Backup successfully saved </br> to path ' + basePath + '\\BackupConf',
      '',
      {
        closeButton: true,
        timeOut: 4000,
        progressBar: true,
        enableHtml: true
      }
    );
  }

  fileDeleted() {
    this.toastr.success('File successfully deleted', '', {
      closeButton: true,
      timeOut: 4000,
      progressBar: true,
      enableHtml: true
    });
  }
}
