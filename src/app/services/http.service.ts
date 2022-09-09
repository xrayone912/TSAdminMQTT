import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MqttStatus } from "../models/devices";
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  

  login(ip: string, username: string, password: string): Observable<any> {
    return this.http.get<any>(
      environment.httpBaseUrl + username + ':' + password + '@' + ip
    );
  }

  updateCredentials(
    ip: string,
    username: string,
    password: string
  ): Observable<any> {
    let credentials =
      '/cm?user=' + username + '&password=' + password + '&cmnd=status';
    return this.http.get<any>(environment.httpBaseUrl + ip + credentials);
  }

  setMqttEnable(ip: string): Observable<any> {
    return this.http.get<any>(
      environment.httpBaseUrl + ip + environment.mqttEnable
    );
  }

  setMqttDisabled(ip: string): Observable<any> {
    return this.http.get<any>(
      environment.httpBaseUrl + ip + environment.mqttDisable
    );
  }

  setMqttHost(ip: string, hostIp: string){
    return this.http.get<any>(
      environment.httpBaseUrl + ip + environment.setMqttHost + hostIp
    );
  }

  setMqttTopic(ip: string, topic: string){
    return this.http.get<any>(
      environment.httpBaseUrl + ip + environment.setMqttTopic + topic
    );
  }

  getMQTTStatus(ip: string){
    return this.http.get<any>(
      environment.httpBaseUrl + ip + environment.getMqttStatus
    );
  }

  checkTsFwUpdate(){
    return this.http.get<any>(
      environment.tsFwUrl
    );
  }
}
