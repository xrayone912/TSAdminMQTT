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

declare const findAllDevices: any;

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  returnMsg!: string;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  roomName = '';
  hide = true;
  hideSpinner!: boolean;
  scan!: boolean;
  localIp = '';
  disableMqttHostButton = true;
  disableMqttTopicButton = true;
  public ipc: IpcRenderer | undefined;

  constructor(
    public deviceStorage: DeviceStorage,
    private dbService: NgxIndexedDBService,
    private _formBuilder: FormBuilder,
    public roomsArray: Room_Array,
    private toastr: ToastrService,
    public httpService: HttpService
  ) {
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

  async getAllTsAdapter() {
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

  updateCredentials(index: number) {
    let ip = this.deviceStorage.Devices[index].ip;
    let username = this.deviceStorage.Devices[index].userName;
    let password = this.deviceStorage.Devices[index].password;
    this.httpService.updateCredentials(ip, username, password).subscribe({
      next: (data: any) => {
        data[environment.Status].ip = ip;
        data[environment.Status].userName = username;
        data[environment.Status].password = password;
        data[environment.Status].setCredentials = true;
        this.deviceStorage.Devices.splice(index, 1, data[environment.Status]);
        this.showUpdate();
      }
    });
  }

  saveAdapter(drop: boolean) {
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
          password: element.password
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

  restartApp() {
    setTimeout(() => {
      this.ipc?.send('restart');
    }, 2000);
  }

  addRoom(name: string) {
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

  dropDevices(event: CdkDragDrop<string[]>, drop: boolean) {
    moveItemInArray(
      this.deviceStorage.Devices,
      event.previousIndex,
      event.currentIndex
    );
    this.saveAdapter(drop);
  }

  dropRooms(event: CdkDragDrop<string[]>) {
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

  getRoomsFromIndexedDB() {
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

  enableMqttforAllDevices() {
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
  }

  disableMqttforAllDevices() {
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {            
          });
      }
      setTimeout(() => {
         this.httpService.setMqttDisabled(device.ip).subscribe((result) => {});
      }, 2000);
    });
  }

  setMqttHost(){
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {            
          });
      }
      setTimeout(() => {
         this.httpService.setMqttHost(device.ip, this.localIp).subscribe((result) => {});
      }, 2000);
    });
    this.showMqttHostSet();
  }

  setMqttTopic(){
    this.deviceStorage.Devices.forEach((device) => {
      if (device.userName !== undefined) {
        this.httpService
          .login(device.ip, device.userName, device.password)
          .subscribe((result) => {            
          });
      }
      setTimeout(() => {
         this.httpService.setMqttTopic(device.ip, device.ip).subscribe((result) => {});
      }, 2000);
    });
    this.showMqttTopicSet();
  }

  getLocalIp() {
    (async () => {
      this.localIp = await this.ipc?.invoke('getIp');
    })();
  }

  deleteRoom(id: number) {
    this.roomsArray.Rooms = this.roomsArray.Rooms.filter(
      (item) => item.id !== id
    );
    this.dbService.bulkDelete('rooms', [id]).subscribe((result) => {});
  }

  showSuccess() {
    this.toastr.success(environment.toastrSaved, '', {
      closeButton: true,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }
  showRestart() {
    this.toastr.warning(environment.toastrRestart, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }
  showUpdate() {
    this.toastr.success(environment.toastrDeviceUpdate, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
  }

  showMqttEnabled() {
    this.toastr.success(environment.toastrMQTTenabled, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
    setTimeout(() => {
      this.disableMqttHostButton = false;
    }, 3000);
    
  }

  showMqttHostSet() {
    this.toastr.success(environment.toastrMQTTsetHost, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });
    setTimeout(() => {
      this.disableMqttTopicButton = false;
    }, 3000);
    
  }
  
  showMqttTopicSet() {
    this.toastr.success(environment.toastrMQTTsetTopic, '', {
      closeButton: environment.toastrcloseButton,
      timeOut: environment.toastrTimeOut,
      progressBar: environment.toastrProgressBar
    });  
  }
}
