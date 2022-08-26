export interface Devices {
  ip: string;
  Module: number;
  FriendlyName: string[];
  DeviceName: string;
  Topic: string;
  ButtonTopic: string;
  Power: number;
  PowerOnState: number;
  LedState: number;
  SaveData: number;
  SaveState: Number;
  SwitchTopic: string;
  SwitchMode: number[];
  ButtonRetain: number;
  SwitchRetain: number;
  SensorRetain: number;
  PowerRetain: number;
  LedMask: string;
  Room: number;
  setCredentials: boolean;
  userName: string;
  password: string;
}

export class DeviceStorage {
  Devices: Devices[] = [];
  CacheDevices: Devices[] = [];
}

export interface Adapter_Array {
  ip: string;
  Module: number;
  FriendlyName: string[];
  DeviceName: string;
  Topic: string;
  ButtonTopic: string;
  Power: number;
  PowerOnState: number;
  LedState: number;
  SaveData: number;
  SaveState: Number;
  SwitchTopic: string;
  SwitchMode: number[];
  ButtonRetain: number;
  SwitchRetain: number;
  SensorRetain: number;
  PowerRetain: number;
  LedMask: string;
  Room: number;
  setCredentials: boolean;
  userName: string;
  password: string;
  isAlive: boolean;
}

export class Adapter {
  Adapter: Adapter_Array[] = [];
}

export class global {
  ip!: string;
  userName!: string;
  password!: string;
  darkMode = true;
  isTutorial!: boolean;
}
