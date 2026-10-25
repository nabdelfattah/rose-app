import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, ThemeService } from '@rose-app/ui';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideNoopAnimations(),
        provideStore({ user: () => ({ isLoading: false }) }),
        provideRouter([]),
        provideHttpClient(),
        CookieService,
        {
          provide: Actions,
          useValue: of(),
        },
        {
          provide: TranslateService,
          useValue: {
            use: () => of(),
            get: () => of(''),
          },
        },
        LanguageService,
        ThemeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
