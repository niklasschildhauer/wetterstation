import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ESPConfiguration, ESPConfigurationAPIService } from 'src/app/services/api/esp-configuration-api.service';

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

  loadConfigurations() {
    this.spinner.show()
    this.espConfigurationService.loadESPConfigs().subscribe((data) => {
      this.espConfigurations = data;
      this.spinner.hide()
    })
  }

}
