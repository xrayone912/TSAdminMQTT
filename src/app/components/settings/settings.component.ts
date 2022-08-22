import { Component, ErrorHandler, OnInit } from '@angular/core';
import {
  MatBottomSheet,
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

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SettingsComponent>,
    public httpService: HttpService,
    public global: global,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.urlConfig = 'http://' + this.global.ip + '/?';

    this.trustedUrlConfig = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlConfig
    );
  }
}
