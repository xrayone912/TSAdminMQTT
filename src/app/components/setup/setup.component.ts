import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DeviceStorage } from 'src/app/models/devices';
import { Room_Array } from '../../models/rooms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { IpcRenderer } from 'electron';
import { HttpService } from 'src/app/services/http.service';
import { environment } from '../../../environments/environment';
import { MqttInfo, MqttStatus } from '../../models/devices';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from "../dialog/warning/warning.component";
import { Warning2Component } from "../dialog/warning2/warning2.component";

declare const findAllDevices: any;
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
 public dataSource = new MatTableDataSource<MqttStatus>([]);
 public returnMsg!: string;
 public firstFormGroup!: FormGroup;
 public secondFormGroup!: FormGroup;
 public thirdFormGroup!: FormGroup;
 public roomName = '';
 public hide = true;
 public hideSpinner!: boolean;
 public hideRefreshSpinner = true;
 public scan!: boolean;
 public localIp = '';
 public disableMqttHostButton = true;
 public disableMqttTopicButton = true;
 public displayedColumns: any[] = [
    'deviceId',
    'mqttState',
    'mqttPort',
    'mqttHost',
    'Topic'
  ];

  public ipc: IpcRenderer | undefined;

  constructor(
    public deviceStorage: DeviceStorage,
    private dbService: NgxIndexedDBService,
    private _formBuilder: FormBuilder,
    public roomsArray: Room_Array,
    private toastr: ToastrService,
    public httpService: HttpService,
    public mqttStatus: MqttInfo,
    public dialog: MatDialog,
  ) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } 
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['']
    });

    setTimeout(() => {
      if (this.deviceStorage.Devices.length > 0) {
        this.scan = true;
        this.hideSpinner = true;
      }
      if (this.roomsArray.Rooms.length === 0) {
        this.getRoomsFromIndexedDB();
      }
    }, 1000);

    this.getLocalIp();
  }

  public async getAllTsAdapter() {
    this.hideSpinner = false;
    this.scan = true;
    this.deviceStorage.Devices = [] = [];
    let tsAdapter = await findAllDevices();

    setTimeout(() => {
      if (tsAdapter.length > 0) {
        this.hideSpinner = true;
        this.scan = false;
        this.deviceStorage.Devices = tsAdapter;
      }
    }, 15000);
  }

  public updateCredentials(index: number) {
    let ip = this.deviceStorage.Devices[index].ip;
    let username = this.deviceStorage.Devices[index].userName;
    let password = this.deviceStorage.Devices[index].password;
    this.httpService.updateCredentials(ip, username, password).subscribe({
      next: (data: any) => {
        data[environment.Status].ip = ip;
        data[environment.Status].userName = username;
        data[environment.Status].password = password;
        data[environment.Status].setCredentials = true;
        data[environment.Status].is401 = false;
        this.deviceStorage.Devices.splice(index, 1, data[environment.Status]);
        this.showUpdate();
      }
    });
  }
  
 public saveAdapter(drop: boolean) {
    this.dbService.clear('adpater').subscribe((successDeleted) => {});
    this.deviceStorage.Devices.forEach((element) => {
      this.dbService
        .add('adpater', {
          Module: element.Module,
          FriendlyName: element.FriendlyName,
          Topic: element.Topic,
          ButtonTopic: element.ButtonTopic,
          Power: element.Power,
          PowerOnState: element.PowerOnState,
          LedState: element.LedState,
          SaveData: element.SaveData,
          SaveState: element.SaveState,
          SwitchTopic: element.SwitchTopic,
          SwitchMode: element.SwitchMode,
          ButtonRetain: element.ButtonRetain,
          SwitchRetain: element.SwitchRetain,
          SensorRetain: element.SensorRetain,
          PowerRetain: element.PowerRetain,
          ip: element.ip,
          Room: element.Room,
          setCredentials: element.setCredentials,
          userName: element.userName,
          password: element.password,
          is401: element.is401
        })
        .subscribe((key) => {
          this.returnMsg = 'Data added successfully';
        });
    });
    if (drop) {
      this.showSuccess();
    } else {
      this.showSuccess();
      this.showRestart();
      this.restartApp();
    }
  }

  public restartApp() {
    setTimeout(() => {
      this.ipc?.send('restart');
    }, 2000);
  }

  public addRoom(name: string) {
    this.dbService
      .add('rooms', {
        name: name,
        sortOrder: this.roomsArray.Rooms.length + 1
      })
      .subscribe((key) => {
        this.returnMsg = 'Data added successfully';
        var room = {
          id: key.id,
          name: key.name,
          sortOrder: this.roomsArray.Rooms.length + 1
        };
        this.roomsArray.Rooms.push(room);
      });
  }

  public dropDevices(event: CdkDragDrop<string[]>, drop: boolean) {
    moveItemInArray(
      this.deviceStorage.Devices,
      event.previousIndex,
      event.currentIndex
    );
    this.saveAdapter(drop);
  }

  public dropRooms(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.roomsArray.Rooms,
      event.previousIndex,
      event.currentIndex
    );
    this.roomsArray.Rooms.forEach((element, index) => {
      this.dbService
        .update('rooms', {
          id: element.id,
          name: element.name
        })
        .subscribe((rooms) => {});
    });
  }

  public getRoomsFromIndexedDB() {
    this.dbService.getAll('rooms').subscribe((rooms: any[]) => {
      rooms.forEach((element) => {
        var room = {
          name: element.name,
          id: element.id
        };
        this.roomsArray.Rooms.push(room);
      });
    });
  }

  public enableMqttforAllDevices() {
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {});
      }
      setTimeout(() => {
        this.httpService.setMqttEnable(device.ip).subscribe((result) => {});
      }, 2000);
    });
    this.showMqttEnabled();
    this.getMqttStatus();
  }

  public disableMqttforAllDevices() {
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {});
      }
      setTimeout(() => {
        this.httpService.setMqttDisabled(device.ip).subscribe((result) => {});
      }, 2000);
    });
    this.getMqttStatus();
  }

  public setMqttHost() {
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {});
      }
      setTimeout(() => {
        this.httpService
          .setMqttHost(device.ip, this.localIp)
          .subscribe((result) => {});
      }, 2000);
    });
    this.showMqttHostSet();
    this.getMqttStatus();
  }

  public setMqttTopic() {
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {});
      }
      setTimeout(() => {
        this.httpService
          .setMqttTopic(device.ip, device.ip)
          .subscribe((result) => {});
      }, 2000);
    });
    this.showMqttTopicSet();
    this.getMqttStatus();
  }

  getLocalIp() {
    (async () => {
      this.localIp = await this.ipc?.invoke('getIp');
    })();
  }

  public getMqttStatus() {
    this.dataSource.data = [];
    this.mqttStatus.mqttInfo = [];

   this.hideRefreshSpinner = false;
    
      this.deviceStorage.Devices.forEach((device) => {
        try {
          if (device.userName !== undefined) {
            this.httpService
              .login(device.ip, device.userName, device.password)
              .subscribe((result) => {});
          }
          setTimeout(() => {
            this.httpService.getMQTTStatus(device.ip).subscribe((result) => {
              if (
                result[environment.Status].Topic !== undefined &&
                result[environment.StatusMQT] !== undefined
              ) {
                let info = {
                  deviceId: result[environment.StatusNET].IPAddress,
                  mqttHost: result[environment.StatusMQT].MqttHost,
                  mqttPort: result[environment.StatusMQT].MqttPort,
                  mqttTopic: result[environment.Status].Topic,
                  mqttState: true
                };
                this.mqttStatus.mqttInfo.push(info);
                this.dataSource.data = this.mqttStatus.mqttInfo;
              } else {
                let info = {
                  deviceId: result[environment.StatusNET].IPAddress,
                  mqttHost: environment.notAvailableFlag,
                  mqttPort: environment.notAvailableFlag,
                  mqttTopic: environment.notAvailableFlag,
                  mqttState: false
                };
                this.mqttStatus.mqttInfo.push(info);
                this.dataSource.data = this.mqttStatus.mqttInfo;
              }
            });
          }, 5000);
        } catch (error) {}
      });
  }

  public deleteRoom(id: number) {
    this.roomsArray.Rooms = this.roomsArray.Rooms.filter(
      (item) => item.id !== id
    );
    this.dbService.bulkDelete('rooms', [id]).subscribe((result) => {});
  }

  public openMqttHostDialog() {
    const dialogRef = this.dialog.open(WarningComponent);
    dialogRef.afterClosed().subscribe((result) => {});
    const sub = dialogRef.componentInstance.onAdd.subscribe(() => {
      this.setMqttHost();
    });
  }

  public openMqttTopicDialog() {
    const dialogRef = this.dialog.open(Warning2Component);
    dialogRef.afterClosed().subscribe((result) => {});
    const sub = dialogRef.componentInstance.onAdd.subscribe(() => {
      this.setMqttTopic();
    });
  }

  public showSuccess() {
    this.toastr.success(environment.toastrSaved, '', {
      closeButton: true,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }
  public showRestart() {
    this.toastr.warning(environment.toastrRestart, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }
  public showUpdate() {
    this.toastr.success(environment.toastrDeviceUpdate, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }

  public showMqttEnabled() {
    this.toastr.success(environment.toastrMQTTenabled, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
    setTimeout(() => {
      this.disableMqttHostButton = false;
    }, 5000);
  }

  public showMqttHostSet() {
    this.toastr.success(environment.toastrMQTTsetHost, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
    setTimeout(() => {
      this.disableMqttTopicButton = false;
    }, 5000);
  }

 public showMqttTopicSet() {
    this.toastr.success(environment.toastrMQTTsetTopic, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }
}
