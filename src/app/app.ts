import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';

import { Sidebar } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
})
export class App {
  isLoginPage = false;

  constructor(private router: Router) {
    this.updateRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateRoute());
  }

  private updateRoute(): void {
    this.isLoginPage = this.router.url.split('?')[0] === '/login';
  }
}