import { Component, Inject, Input, OnInit } from '@angular/core';
import { ESPConfiguration, ESPConfigurationAPIService } from 'src/app/services/api/esp-configuration-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-configuration-tile-view',
  templateUrl: './configuration-tile-view.component.html',
  styleUrls: ['./configuration-tile-view.component.scss']
})
export class ConfigurationTileViewComponent implements OnInit {
  @Input() espConfiguration?: ESPConfiguration
  
  constructor(private espConfigurationService: ESPConfigurationAPIService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfigurationTilePopUpDialogView, {
      width: '300px',
      data: this.espConfiguration?.roomName
    });

    dialogRef.afterClosed().subscribe(result => {
      if(this.espConfiguration && result !== undefined && result !== '') {
        this.espConfiguration.roomName  = result;  
        console.log("re", result, this.espConfiguration.roomName);
        this.updateConfiguration();
      }
    });
  }

  updateConfiguration() {
    if(this.espConfiguration) {
      this.espConfigurationService.postESPConfiguration(this.espConfiguration).subscribe((data) => {
        console.log("changed data", data)
        //FIXME -> console.log entfernen
      })
    }
  }
}

@Component({
  selector: 'configuration-tile-popup-view',
  templateUrl: 'configuration-tile-popup-view.component.html',
  styleUrls: ['./configuration-tile-popup-view.component.scss']
})
export class ConfigurationTilePopUpDialogView {
  name = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ConfigurationTilePopUpDialogView>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.name.value)
  }
}
