import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService, ThemeService } from '@rose-app/ui';
import { productsReducer } from '../../features/products/store/products.reducer';
import { cartReducer } from '../../features/cart/store/cart.reducer';
import { wishlistReducer } from '../../features/wishlist/store/wishlist.reducer';
import { addressReducer } from '../../shared/components/address/store/address.reducer';
import { notificationsReducer } from '../../features/notification/store/notifications.reducer';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        // the header (and the notifications panel inside it) reads all of these slices
        provideStore({
          user: () => ({ isLoading: false }),
          products: productsReducer,
          cart: cartReducer,
          wishlist: wishlistReducer,
          address: addressReducer,
          notifications: notificationsReducer,
        }),
        provideRouter([]),
        provideHttpClient(),
        CookieService,
        {
          provide: Actions,
          useValue: of(),
        },
        // real service with no loader => the pipe shows the translation keys
        provideTranslateService({ fallbackLang: 'en' }),
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
