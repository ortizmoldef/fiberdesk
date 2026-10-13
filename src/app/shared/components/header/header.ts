
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  openSection(section: string): void {
    this.closeUserMenu();

    // Las páginas se implementarán más adelante.
    console.log(`Sección seleccionada: ${section}`);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeUserMenu();
  }
}
