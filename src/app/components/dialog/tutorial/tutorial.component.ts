import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { global } from '../../../models/devices';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  public ipc: IpcRenderer | undefined;
  localIp = '';
  private subs = new SubSink();

  global$!: Observable<global>;

  constructor(
    public globalData: global,
    private dbService: NgxIndexedDBService
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

  ngOnInit() {
    this.getLocalIp();
  }

 public getTutorialInfo() {
 this.subs.sink = this.dbService.getByKey('tutorial', 1).subscribe((tutorial: any) => {
      if (tutorial !== null) {
        this.globalData.isTutorial = tutorial;
      }
    });
  }

  public getLocalIp() {
    (async () => {
      this.localIp = await this.ipc?.invoke('getIp');
    })();
  }

  public saveGlobal() {
    const data = {
      tutorial: !this.globalData.isTutorial
    };
    this.subs.sink = this.dbService.getByKey('tutorial', 1).subscribe((tutorial) => {
      if (tutorial !== null) {
        this.subs.sink = this.dbService
          .update('tutorial', {
            id: 1,
            tutorial: data.tutorial
          })
          .subscribe((storeData) => {});
      } else {
        this.subs.sink = this.dbService
          .add('tutorial', {
            tutorial: data.tutorial
          })
          .subscribe((storeData) => {});
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
}
