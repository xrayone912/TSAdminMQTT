import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { SetupComponent } from './components/setup/setup.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeviceStorage, global, MqttInfo } from './models/devices';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { Room_Array } from './models/rooms';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './components/settings/settings.component';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { ToastrModule } from 'ngx-toastr';
import { TutorialComponent } from './components/dialog/tutorial/tutorial.component';
import { ResetSettingsComponent } from './components/dialog/resetSettings/resetSettings.component';
import { WarningComponent } from "./components/dialog/warning/warning.component";
import { Warning2Component } from "./components/dialog/warning2/warning2.component";

const dbConfig: DBConfig = {
  name: 'SHAdmin.DB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'rooms',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'roomName', keypath: 'roomName', options: { unique: false } },
        { name: 'sortOrder', keypath: 'sortOrder', options: { unique: false } }
      ]
    },
    {
      store: 'darkmode',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'darkmode', keypath: 'darkmode', options: { unique: false } },
        { name: 'value', keypath: 'value', options: { unique: false } }
      ]
    },
    {
      store: 'fwinfo',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'fwinfo', keypath: 'fwinfo', options: { unique: false } },
        { name: 'value', keypath: 'value', options: { unique: false } }
      ]
    },
    {
      store: 'tutorial',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'tutorial', keypath: 'tutorial', options: { unique: false } }
      ]
    },
    {
      store: 'adpater',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'Module', keypath: 'Module', options: { unique: false } },
        {
          name: 'FriendlyName',
          keypath: 'FriendlyName',
          options: { unique: false }
        },
        { name: 'Topic', keypath: 'Topic', options: { unique: false } },
        {
          name: 'ButtonTopic',
          keypath: 'ButtonTopic',
          options: { unique: false }
        },
        { name: 'Power', keypath: 'Power', options: { unique: false } },
        {
          name: 'PowerOnState',
          keypath: 'PowerOnState',
          options: { unique: false }
        },
        { name: 'LedState', keypath: 'LedState', options: { unique: false } },
        { name: 'SaveData', keypath: 'SaveData', options: { unique: false } },
        { name: 'SaveState', keypath: 'SaveState', options: { unique: false } },
        {
          name: 'SwitchTopic',
          keypath: 'SwitchTopic',
          options: { unique: false }
        },
        {
          name: 'SwitchMode',
          keypath: 'SwitchMode',
          options: { unique: false }
        },
        {
          name: 'ButtonRetain',
          keypath: 'ButtonRetain',
          options: { unique: false }
        },
        {
          name: 'SwitchRetain',
          keypath: 'SwitchRetain',
          options: { unique: false }
        },
        {
          name: 'SensorRetain',
          keypath: 'SensorRetain',
          options: { unique: false }
        },
        {
          name: 'PowerRetain',
          keypath: 'PowerRetain',
          options: { unique: false }
        },
        { name: 'ip', keypath: 'ip', options: { unique: false } },
        { name: 'Room', keypath: 'Room', options: { unique: false } }
      ]
    }
  ]
};

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
  hostname: 'localhost',
  port: 8888,
  path: '/mqtt'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SetupComponent,
    SettingsComponent,
    TutorialComponent,
    ResetSettingsComponent,
    WarningComponent,
    Warning2Component
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    DragDropModule,
    MatGridListModule,
    MatTabsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    HttpClientModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [DeviceStorage, Room_Array, global, MqttInfo],
  bootstrap: [AppComponent]
})
export class AppModule {}
