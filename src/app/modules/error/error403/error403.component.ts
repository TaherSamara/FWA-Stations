import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css'],
})
export class Error403Component {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
