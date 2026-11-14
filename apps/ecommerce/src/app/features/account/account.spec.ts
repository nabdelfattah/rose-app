import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { Account } from './account';
import { AccountService } from './service/account.service';
import { userActions } from '../auth/store/user.actions';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      account: {
        title: 'Account Settings',
        tabs: {
          profile: 'Profile',
          changePassword: 'Change Password',
        },
        logout: 'Log out',
        deleteModal: {
          success: 'Account deleted successfully.',
          error: 'Failed to delete account.',
        },
      },
    });
  }
}

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;
  let store: MockStore;
  let confirmationService: ConfirmationService;
  let accountServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
  };
  let messageServiceMock: {
    add: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    accountServiceMock = {
      getProfile: vi.fn().mockReturnValue(
        of({
          status: true,
          code: 200,
          payload: {
            user: {
              id: '1',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
            },
          },
        })
      ),
      deleteAccount: vi.fn().mockReturnValue(of({})),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        provideMockStore(),
        ConfirmationService,
        { provide: AccountService, useValue: accountServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    confirmationService = TestBed.inject(ConfirmationService);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with profile tab active by default', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab()).toBe('profile');
  });

  it('should switch tabs between profile and password', () => {
    component.selectTab('password');
    expect(component.activeTab()).toBe('password');

    component.selectTab('profile');
    expect(component.activeTab()).toBe('profile');
  });

  it('should dispatch userActions.logout when logout is called', () => {
    component.logout();
    expect(store.dispatch).toHaveBeenCalledWith(userActions.logout());
  });

  it('should trigger confirmation service on delete account request', () => {
    const confirmSpy = vi.spyOn(confirmationService, 'confirm');
    component.onDeleteAccountRequested();

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'deleteAccount' })
    );
  });

  it('should call deleteAccount and dispatch logout on confirmation accept', () => {
    component.confirmDeleteAccount();

    expect(accountServiceMock.deleteAccount).toHaveBeenCalled();
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(userActions.logout());
  });
});
