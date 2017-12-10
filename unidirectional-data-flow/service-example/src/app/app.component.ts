import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(httpClient: HttpClient) {
    // const obs = httpClient.get('https://hacker-news.firebaseio.com/v0/topstories.json').publish();
    // const obs = httpClient.get('https://hacker-news.firebaseio.com/v0/topstories.json').publish().refCount();
    // const obs = httpClient.get('https://hacker-news.firebaseio.com/v0/topstories.json').share();

    const intervalObservable = (interval) => {
      return {
        subscribe: (observer) => {
          let i = 0;
          const intervalRef = window.setInterval(() => {
            observer.next(i++);
          }, interval);
          return () => {
            clearInterval(intervalRef);
          };
        }
      }
    };

    const subscription = intervalObservable(500).subscribe({next: console.log});
    setTimeout(subscription, 3000);
  }
}
