import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { MapComponent } from './components/game/map/map.component';
import { DialogueComponent } from './components/game/dialogue/dialogue.component';
import { HeaderComponent } from './components/game/header/header.component';
import { LocationComponent } from './components/game/location/location.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    MapComponent,
    DialogueComponent,
    HeaderComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
