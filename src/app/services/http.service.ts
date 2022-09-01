import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://';

  login(ip: string, username: string, password: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + username + ':' + password + '@' + ip
    );
  }

  updateCredentials(
    ip: string,
    username: string,
    password: string
  ): Observable<any> {
    let credentials =
      '/cm?user=' + username + '&password=' + password + '&cmnd=status';
    return this.http.get<any>(this.baseUrl + ip + credentials);
  }
}
