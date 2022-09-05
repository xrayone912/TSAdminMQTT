export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  environmentName: 'window',
  key: 'Windows',
  //mqtt http command enable
  mqttEnable: '/cm?cmnd=SetOption3 1',
  //mqtt http command enable
  mqttDisable: '/cm?cmnd=SetOption3 0',
  //mqtt http command set mqtt host
  setMqttHost: '/cm?cmnd=MqttHost ',
  //mqtt http command set mqtt topic
  setMqttTopic: '/cm?cmnd=Topic ',
  //tasmota STATUS string get TS Version
  StatusFWR: 'StatusFWR',
  //device get Power state 1 or 0 from cmnd/xxx.xxx.xxx.xxx/Status
  Status: 'Status',
  //get fro cmnd/xxx.xxx.xxx.xxx/Status 0 WIFI informations
  StatusSTS: 'StatusSTS',
  //switch into WIFI for get wifi signal strength
  WIFI: 'Wifi',
  //mqtt base command
  cmnd: 'cmnd/',
  //cmnd flag 0
  cmndFlagZero: '0',
  //cmnd flag 1
  cmndFlagOne: '1',
  //cmnd status
  cmndstatus: '/STATUS',
  //cmnd power command
  cmndPower: '/POWER',
  //http base url
  httpBaseUrl: 'http://',
  //backup donload suffix url
  suffixDL: '/dl',
  //path to windows backup folder
  readPathBackupFolder: '\\BackupConf',
  //path to windows backup folder
  deletePathBackupFolder: '\\BackupConf\\',
  //file extension backup
  fileExtension: '.dmp',
  //toastr closeButton
  toastrcloseButton: true,
  //toastr timeout in ms
  toastrTimeOut: 4000,
  //toastr show progressbar
  toastrProgressBar: true,
  //toastr 401 warning message
  toastr401:
    'Unauthorized access 401 </br> No or wrong credentials </br> for this adapter',
  //toastr success dl message
  toastrSuccessDL: 'Backup successfully saved </br> to path ',
  //toastr delete dl message
  toastrDeleteDL: 'File successfully deleted',
  //toastr restart message
  toastrRestart: 'Application restarts',
  //toastr device update message
  toastrDeviceUpdate: 'Device successfully updated',
  //toastr saved message
  toastrSaved: 'Successfully saved',
  //toastr mqtt enabeld
  toastrMQTTenabled: 'MQTT will be activated',
  //toastr mqtt set host
  toastrMQTTsetHost: 'MQTT host will be set',
  //toastr mqtt set topic
  toastrMQTTsetTopic: 'MQTT topic will be set',
};
