'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">wetterstation documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-2c044513fab57c50fd51f326d8385da9"' : 'data-target="#xs-components-links-module-AppModule-2c044513fab57c50fd51f326d8385da9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-2c044513fab57c50fd51f326d8385da9"' :
                                            'id="xs-components-links-module-AppModule-2c044513fab57c50fd51f326d8385da9"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ScreensModule.html" data-type="entity-link">ScreensModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ScreensModule-1e0d9f6c86e301e7df425dc9ef1d8aad"' : 'data-target="#xs-components-links-module-ScreensModule-1e0d9f6c86e301e7df425dc9ef1d8aad"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ScreensModule-1e0d9f6c86e301e7df425dc9ef1d8aad"' :
                                            'id="xs-components-links-module-ScreensModule-1e0d9f6c86e301e7df425dc9ef1d8aad"' }>
                                            <li class="link">
                                                <a href="components/DashboardScreenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardScreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailScreenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailScreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnboardingScreenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OnboardingScreenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsScreenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsScreenComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UiElementsModule.html" data-type="entity-link">UiElementsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UiElementsModule-3b1f99c998c187d18f434f2c95a33923"' : 'data-target="#xs-components-links-module-UiElementsModule-3b1f99c998c187d18f434f2c95a33923"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UiElementsModule-3b1f99c998c187d18f434f2c95a33923"' :
                                            'id="xs-components-links-module-UiElementsModule-3b1f99c998c187d18f434f2c95a33923"' }>
                                            <li class="link">
                                                <a href="components/BackButtonElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BackButtonElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CardElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CardElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CheckboxSwitcherElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxSwitcherElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuBarElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuBarElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuButtonElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuButtonElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavBarElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavBarElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PollenListElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PollenListElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PollenTagElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PollenTagElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressChartElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgressChartElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SliderElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SliderElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TtsPlayerElementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TtsPlayerElementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ViewsModule.html" data-type="entity-link">ViewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ViewsModule-198db56bbc3640719b0e80ae3d17308c"' : 'data-target="#xs-components-links-module-ViewsModule-198db56bbc3640719b0e80ae3d17308c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ViewsModule-198db56bbc3640719b0e80ae3d17308c"' :
                                            'id="xs-components-links-module-ViewsModule-198db56bbc3640719b0e80ae3d17308c"' }>
                                            <li class="link">
                                                <a href="components/ApparentTemperatureTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApparentTemperatureTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalibrationInfoDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalibrationInfoDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationTilePopUpDialogView.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigurationTilePopUpDialogView</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigurationTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigurationViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForecastDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForecastDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForecastTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForecastTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HumidityTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HumidityTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IndoorDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IndoorDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IndoorTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IndoorTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OpenAPELoginTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OpenAPELoginTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OutdoorWeatherDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OutdoorWeatherDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OutdoorWeatherViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OutdoorWeatherViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalizationSettingsViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PersonalizationSettingsViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalizationViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PersonalizationViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PollenflugDetailViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PollenflugDetailViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PollenflugSmallTileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PollenflugSmallTileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PollenflugTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PollenflugTileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrationViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimpleTileViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SimpleTileViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ESPConfigurationAPIService.html" data-type="entity-link">ESPConfigurationAPIService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HistoryTileService.html" data-type="entity-link">HistoryTileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link">ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageService.html" data-type="entity-link">LocalStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SpeechService.html" data-type="entity-link">SpeechService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TextService.html" data-type="entity-link">TextService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TileService.html" data-type="entity-link">TileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserContextAPIService.html" data-type="entity-link">UserContextAPIService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserContextService.html" data-type="entity-link">UserContextService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherAPIService.html" data-type="entity-link">WeatherAPIService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherDataService.html" data-type="entity-link">WeatherDataService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CheckTokenResponse.html" data-type="entity-link">CheckTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ESPConfiguration.html" data-type="entity-link">ESPConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastResponse.html" data-type="entity-link">ForecastResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphDataSet.html" data-type="entity-link">GraphDataSet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageModel.html" data-type="entity-link">ImageModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IndoorRoomData.html" data-type="entity-link">IndoorRoomData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IndoorRoomResponse.html" data-type="entity-link">IndoorRoomResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link">LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutdoorWeatherData.html" data-type="entity-link">OutdoorWeatherData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutdoorWeatherResponse.html" data-type="entity-link">OutdoorWeatherResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PollenData.html" data-type="entity-link">PollenData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PollenResponse.html" data-type="entity-link">PollenResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PollenType.html" data-type="entity-link">PollenType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tile.html" data-type="entity-link">Tile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TileArrays.html" data-type="entity-link">TileArrays</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserContext.html" data-type="entity-link">UserContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserContextResponse.html" data-type="entity-link">UserContextResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserIdentifikation.html" data-type="entity-link">UserIdentifikation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherData.html" data-type="entity-link">WeatherData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherForecastData.html" data-type="entity-link">WeatherForecastData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherHistoryByDayData.html" data-type="entity-link">WeatherHistoryByDayData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeatherHistoryData.html" data-type="entity-link">WeatherHistoryData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});