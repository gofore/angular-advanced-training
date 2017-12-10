import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';

@Injectable()
export class HackerNewsService {

  constructor(private httpClient: HttpClient) {
  }

  findAll() {
    return this.httpClient.get('https://hacker-news.firebaseio.com/v0/topstories.json');
  }

  create(data: any) {
    // Simulate creating a new news
    const id = Math.floor(Math.random() * 100000);
    return Observable.of(id).pipe(delay(1000));
  }
}
