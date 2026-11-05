import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'fiberdesk_theme';

  theme: Theme = 'dark';

  loadSavedTheme(): void {
    let savedTheme: Theme = 'dark';

    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem(this.storageKey);

      if (storedTheme === 'light' || storedTheme === 'dark') {
        savedTheme = storedTheme;
      }
    }

    this.setTheme(savedTheme, false);
  }

  setTheme(theme: Theme, save = true): void {
    this.theme = theme;

    this.document.documentElement.classList.toggle(
      'dark',
      theme === 'dark',
    );

    if (save && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  get isDarkTheme(): boolean {
    return this.theme === 'dark';
  }
}