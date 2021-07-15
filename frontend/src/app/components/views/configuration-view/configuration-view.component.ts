import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ESPConfiguration, ESPConfigurationAPIService } from 'src/app/services/api/esp-configuration-api.service';

/**
 * Configuration view component
 * 
 * This component displays the different configuration
 * tile view components. It is aware of all esp configuration
 * objects and passes the data to each tile view. @Carina
 */
@Component({
  selector: 'app-configuration-view',
  templateUrl: './configuration-view.component.html',
  styleUrls: ['./configuration-view.component.scss']
})
export class ConfigurationViewComponent implements OnInit {
  espConfigurations?: ESPConfiguration[]

  constructor(
    private espConfigurationService: ESPConfigurationAPIService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadConfigurations();
  }

  /**
   * Loads the esp configuration objects from the 
   * esp configuration service. It also shows the spinner 
   * when the loading process starts and hides it if it was successful. 
   */
  private loadConfigurations() {
    this.spinner.show()
    this.espConfigurationService.loadESPConfigs().subscribe((data) => {
      this.espConfigurations = data;
      this.spinner.hide()
    })
  }

}
