import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { HackerNewsService } from './hacker-news.service';

@Injectable()
export class HackerNewsWithStateService {
  items = [];

  constructor(private hackerNewsService: HackerNewsService) {
  }

  findAll() {
    this.hackerNewsService.findAll()
      .subscribe((items: number[]) => this.items = items);
  }

  create(data: any) {
    // Simulate creating a new news
    this.hackerNewsService.create(data)
      .subscribe(created => this.items.push(created));
  }
}
