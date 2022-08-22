import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DeviceStorage } from 'src/app/models/devices';
import { Room_Array } from '../../models/rooms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { IpcRenderer } from 'electron';

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
  public ipc: IpcRenderer | undefined;

  constructor(
    public deviceStorage: DeviceStorage,
    private dbService: NgxIndexedDBService,
    private _formBuilder: FormBuilder,
    public roomsArray: Room_Array,
    private toastr: ToastrService
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

  saveAdapter() {
    this.dbService.clear('adpater').subscribe((successDeleted) => {
      //console.log('success? ', successDeleted);
    });
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
    this.showSuccess();
    this.showRestart();
    this.restartApp();
  }

  restartApp() {
    setTimeout(() => {
      this.ipc?.send('restart');
    }, 2000);
  }

  // Add room to NgxIndexedDB
  addRoom(name: string) {
    this.dbService
      .add('rooms', {
        name: name,
        sortOrder: this.roomsArray.Rooms.length + 1
      })
      .subscribe((key) => {
        this.returnMsg = 'Data added successfully';
        //console.log('key: ', key);
        var room = {
          id: key.id,
          name: key.name,
          sortOrder: this.roomsArray.Rooms.length + 1
        };
        this.roomsArray.Rooms.push(room);
      });
  }

  dropDevices(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.deviceStorage.Devices,
      event.previousIndex,
      event.currentIndex
    );
    this.saveAdapter();
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

  deleteRoom(id: number) {
    this.roomsArray.Rooms = this.roomsArray.Rooms.filter(
      (item) => item.id !== id
    );
    this.dbService.bulkDelete('rooms', [id]).subscribe((result) => {
      //console.log('result: ', result);
    });
  }

  showSuccess() {
    this.toastr.success('Successfully saved');
  }
  showRestart() {
    this.toastr.warning('Application restarts');
  }
}
