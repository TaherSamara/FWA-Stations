import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-error503',
  templateUrl: './error503.component.html',
  styleUrls: ['./error503.component.css']
})
export class Error503Component {

  constructor(private router: Router, private appComponent: AppComponent) { }

  relode() {    
    this.router.navigate([this.appComponent.previousUrl]);
  }
}
