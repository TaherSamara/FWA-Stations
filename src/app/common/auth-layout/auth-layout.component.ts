import { Component } from '@angular/core';

/**
 * Shared page for the auth and error screens: login-style background, the
 * animated network graphic on the right, and projected content on the left.
 */
@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
})
export class AuthLayoutComponent {
  // Nodes around the hub: position + animation offset
  nodes = [
    { x: 70, y: 90, d: 0 },
    { x: 335, y: 70, d: 0.6 },
    { x: 360, y: 215, d: 1.2 },
    { x: 305, y: 340, d: 1.8 },
    { x: 105, y: 335, d: 2.4 },
    { x: 40, y: 220, d: 3 },
  ];
}
