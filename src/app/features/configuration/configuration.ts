
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

interface OperationalSettings {
  pageSize: number;
  dateFormat: string;
  defaultOrder: string;
}

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuration.html',
})
export class Configuration implements OnInit {
  activeSection: 'preferences' | 'appearance' | 'activity' | 'system' = 'preferences';

  private readonly storageKey = 'fiberdesk_operational_settings';

  preferences: OperationalSettings = {
    pageSize: 10,
    dateFormat: 'DD/MM/YYYY',
    defaultOrder: 'newest',
  };

  savedMessage = '';

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  selectSection(
    section: 'preferences' | 'appearance' | 'activity' | 'system'
  ): void {
    this.activeSection = section;
    this.savedMessage = '';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  loadPreferences(): void {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      try {
        this.preferences = {
          ...this.preferences,
          ...JSON.parse(saved),
        };
      } catch {
        console.warn('No se pudieron cargar las preferencias.');
      }
    }
  }

  savePreferences(): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.preferences)
    );

    this.savedMessage = 'Las preferencias se han guardado correctamente.';
  }
}
