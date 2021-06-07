import { Component, OnInit } from '@angular/core';
import { ESPConfiguration, ESPConfigurationAPIService } from 'src/app/services/api/esp-configuration-api.service';

@Component({
  selector: 'app-configuration-view',
  templateUrl: './configuration-view.component.html',
  styleUrls: ['./configuration-view.component.scss']
})
export class ConfigurationViewComponent implements OnInit {
  espConfigurations?: ESPConfiguration[]

  constructor(private espConfigurationService: ESPConfigurationAPIService) { }

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations() {
    this.espConfigurationService.loadESPConfigs().subscribe((data) => {
      this.espConfigurations = data;
      console.log("wir haben daten", data);
    })
  }

}
