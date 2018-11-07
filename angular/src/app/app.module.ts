import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { IntroComponent } from './components/game/intro/intro.component';
import { DialogueComponent } from './components/game/dialogue/dialogue.component';
import { SkillPickerComponent } from './components/game/skill-picker/skill-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    IntroComponent,
    DialogueComponent,
    SkillPickerComponent
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
