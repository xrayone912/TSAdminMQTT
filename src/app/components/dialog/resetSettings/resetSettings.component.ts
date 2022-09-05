import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IpcRenderer } from 'electron';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-resetSettings',
  templateUrl: './resetSettings.component.html',
  styleUrls: ['./resetSettings.component.scss']
})
export class ResetSettingsComponent implements OnInit {
  public ipc: IpcRenderer | undefined;

  constructor(
    private dbService: NgxIndexedDBService,
    private toastr: ToastrService
  ) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
    }
  }

  ngOnInit() {}

  deleteIndexedDB() {
    this.dbService
      .deleteDatabase()
      .subscribe((result: any) => {
      });
      this.showRestart();
          this.restartApp();
  }

  showRestart() {
    this.toastr.warning(environment.toastrRestart, '', {
      closeButton: true,
      timeOut: 4000,
      progressBar: true
    });
  }

  restartApp() {
    setTimeout(() => {
      this.ipc?.send('restart');
    }, 2000);
  }
}
