import { Component, Inject, Input, OnInit } from '@angular/core';
import { ESPConfiguration, ESPConfigurationAPIService } from 'src/app/services/api/esp-configuration-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms'; 
import { Router } from '@angular/router';

/**
 * Configuration tile view component
 * 
 * This component displays in form of a tile (widget) the configuration 
 * options of the different esp kits (sensor kits). There are two
 * different kinds of esp kits, for outdoor and indoor. For both it is possible
 * to change the name as well as the frequency and for the indoor sensor kits
 * the calibration can be started. 
 * 
 * For the name change a pop up will be shown.
 */
@Component({
  selector: 'app-configuration-tile-view',
  templateUrl: './configuration-tile-view.component.html',
  styleUrls: ['./configuration-tile-view.component.scss']
})
export class ConfigurationTileViewComponent implements OnInit {
  @Input() espConfiguration?: ESPConfiguration
  
  constructor(private espConfigurationService: ESPConfigurationAPIService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Opens the pop up to change the name
   */
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
  
  /**
   * calls the espConfiguration service and starts the calibration process.
   * If the process is started successfully it redirects to the 
   * calibration info detail view component.
   */
  startCalibration(): void {
    if(this.espConfiguration)
    this.espConfigurationService.startConfiguration(this.espConfiguration?.id).subscribe((success) => {
      if(success) {
        this.router.navigateByUrl('/settings/calibration-info');
      }
    })
  }

  /**
   * Calls the esp configuration service to update the esp configuration by passing
   * the changed object @Carina 
   */
  updateConfiguration() {
    if(this.espConfiguration) {
      this.espConfigurationService.postESPConfiguration(this.espConfiguration).subscribe((data) => {
      })
    }
  }
}

/**
 * Configuration tile pop up dialog component
 * 
 * It shows a text field to change the name of the current sensor
 * kit.
 */
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
