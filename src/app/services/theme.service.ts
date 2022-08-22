import { Injectable } from '@angular/core';

/**
 * dark style settings
 */
export const darkTheme: any = {
  'background-color-card': '#282828',
  'background-color': '#1F1F1F',
  'text-color': '#EFEFEF'
};
/**
 * light style settings
 */
export const lightTheme: any = {
  'background-color-card': '#FFFFFF',
  'background-color': '#FFFFFF',
  'text-color': '#2d2d2d'
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * methode for switch dark or light
   */
  toggleDark() {
    this.setTheme(darkTheme);
  }

  toggleLight() {
    this.setTheme(lightTheme);
  }

  private setTheme(theme: any = {}) {
    Object.keys(theme).forEach((k) =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
