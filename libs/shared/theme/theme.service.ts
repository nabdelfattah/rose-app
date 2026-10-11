import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
    private readonly _platformId = inject(PLATFORM_ID);
    readonly isDark = signal<boolean>(false);

    constructor(){
        this.loadTheme();
    }

    toggle(){
        this.isDark.update(value => !value);
        this.applyTheme();
    }

    loadTheme():void    {
        if(isPlatformBrowser(this._platformId)){
            const theme = localStorage.getItem('theme');
            this.isDark.set(theme === 'dark');
            this.applyTheme();
        }
    }

    applyTheme():void {
        if(isPlatformBrowser(this._platformId)){
            document.documentElement.classList.toggle('dark',this.isDark());
            localStorage.setItem('theme', this.isDark() ? 'dark' : 'light')
        }
    }
}