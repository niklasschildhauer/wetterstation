import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndoorRoomData, WeatherData } from 'src/app/model/weather';
import { FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-indoor-tile-view',
  templateUrl: './indoor-tile-view.component.html',
  styleUrls: ['./indoor-tile-view.component.scss']
})
export class IndoorTileViewComponent implements OnInit {
  @Input()
  set data(data: WeatherData) {
    this._indoorRoom = data as IndoorRoomData;
  }
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  _indoorRoom?: IndoorRoomData

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  openDialog(): void {
    const dialogRef = this.dialog.open(IndoorTilePopUpDialogView, {
      width: '250px',
      data: this._indoorRoom?.roomName
    });

    dialogRef.afterClosed().subscribe(result => {
      if(this._indoorRoom && result != undefined) {
        this._indoorRoom.roomName  = result;  //FIXME
      }
    });
  }
}


@Component({
  selector: 'indoor-tile-popup-view',
  templateUrl: 'indoor-tile-popup-view.component.html',
})
export class IndoorTilePopUpDialogView {
  name = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<IndoorTilePopUpDialogView>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.name.value)
  }

}

