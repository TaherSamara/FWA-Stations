import { Component, OnInit } from '@angular/core';
import { PublicService } from './modules/dash/services/public.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  previousUrl: string | null;
  constructor(private publicService: PublicService, private router: Router) { }

  ngOnInit(): void {
    this.publicService.onlineStatus.subscribe((isOnline) => {
      if (!isOnline) {
        this.previousUrl = this.router.url;
        this.router.navigate(['/error/503']);
      } else {
        if (this.previousUrl) {
          this.router.navigateByUrl(this.previousUrl);
          this.previousUrl = null;
        }
      }
    });
  }
}