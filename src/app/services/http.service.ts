import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  
  baseUrl = "http://"
    
  adapterPowerOn(ip: string, param: string): Observable<any> {
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };    
      return this.http.get<any>(this.baseUrl + ip + param)
    }

    login(ip: string, username: string, password: string): Observable<any> {
    
      return this.http.get<any>(this.baseUrl + username + ':' + password + '@' + ip)
    }
}
