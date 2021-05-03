import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServicesModule } from './services/services.module';
import { UiElementsModule } from './components/ui-elements/ui-elements.module';
import { ScreensModule } from './components/screens/screens.module';
import { ViewsModule } from './components/views/views.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServicesModule,
    UiElementsModule,
    ScreensModule,
    ViewsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
