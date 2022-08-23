import { Component, Input, OnInit } from '@angular/core';
import {
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { HttpService } from '../../services/http.service';
import { global } from '../../models/devices';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  data: any;
  trustedUrlConfig: any;
  urlConfig: any;
  needCredentials!: boolean;

  @Input()
  error!: boolean;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SettingsComponent>,
    public httpService: HttpService,
    public global: global,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log(this.error);
    
    this.urlConfig = 'http://' + this.global.ip + '/?';

    this.trustedUrlConfig = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlConfig
    );
  }
}
