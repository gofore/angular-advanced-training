import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HackerNewsService } from './hacker-news.service';
import { HackerNewsComponent } from './hacker-news/hacker-news.component';


@NgModule({
  declarations: [
    AppComponent,
    HackerNewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    HackerNewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
