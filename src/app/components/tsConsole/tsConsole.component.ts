import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { global } from '../../models/devices';

@Component({
  selector: 'app-tsConsole',
  templateUrl: './tsConsole.component.html',
  styleUrls: ['./tsConsole.component.scss']
})
export class TsConsoleComponent implements OnInit {
  trustedUrlConfig: any;
  urlConfig: any;

  constructor(
    public global: global,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.urlConfig = environment.httpBaseUrl + this.global.ip + '/cs?';

    this.trustedUrlConfig = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlConfig
    );
  }
}
