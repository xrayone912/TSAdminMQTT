import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpService } from '../../services/http.service';
import { global } from '../../models/devices';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  trustedUrlConfig: any;
  urlConfig: any;

  @Input()
  error!: boolean;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SettingsComponent>,
    public global: global,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.urlConfig = environment.httpBaseUrl + this.global.ip + '/?';

    this.trustedUrlConfig = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlConfig
    );
  }
}
