import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css'],
})
export class DashComponent {

  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
