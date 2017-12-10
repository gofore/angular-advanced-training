import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../hacker-news.service';

@Component({
  selector: 'app-hacker-news',
  templateUrl: './hacker-news.component.html',
  styleUrls: ['./hacker-news.component.css']
})
export class HackerNewsComponent implements OnInit {
  idList: number[];

  constructor(private hnService: HackerNewsService) {
  }

  ngOnInit() {
    this.hnService.findAll().subscribe((items: number[]) => this.idList = items);
  }

  create() {
    this.hnService.create({
      title: 'fake news'
    })
      .subscribe(created => this.idList.splice(0, 0, created));
  }
}
