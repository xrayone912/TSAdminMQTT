import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { TutorialComponent } from './components/dialog/tutorial/tutorial.component';
import { environment } from '../environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private subs = new SubSink();

  constructor(
    public dialog: MatDialog,
    private dbService: NgxIndexedDBService,
  ) {}
  ngOnInit(): void {
    console.log(environment.key);
    this.checkShowTutorial();
  }

  title = 'TSAdminMQTT';

  checkShowTutorial() {
   this.subs.sink = this.dbService.getByID('tutorial', 1).subscribe((tutorial: any) => {
      if (tutorial === undefined) {
        this.openDialog();
      } else if (tutorial.tutorial) {
        this.openDialog();
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(TutorialComponent);
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
