import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MessageService } from '@openng/optimus-ui/api';
import { ChangePassword } from './change-password';
import { AccountService } from '../../service/account.service';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      account: {
        password: {
          success: 'Password changed successfully.',
          error: 'Failed to change password.',
        },
      },
    });
  }
}

describe('ChangePassword', () => {
  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;
  let accountServiceMock: {
    changePassword: ReturnType<typeof vi.fn>;
  };
  let messageServiceMock: {
    add: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    accountServiceMock = {
      changePassword: vi.fn().mockReturnValue(of({ status: true, message: 'Password changed' })),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with initial state', () => {
    expect(component).toBeTruthy();
    expect(component.showOldPassword()).toBe(false);
    expect(component.showNewPassword()).toBe(false);
    expect(component.showConfirmPassword()).toBe(false);
  });

  it('should toggle password visibility independently for each field', () => {
    component.toggleOldPassword();
    expect(component.showOldPassword()).toBe(true);
    expect(component.showNewPassword()).toBe(false);
    expect(component.showConfirmPassword()).toBe(false);

    component.toggleNewPassword();
    expect(component.showOldPassword()).toBe(true);
    expect(component.showNewPassword()).toBe(true);
    expect(component.showConfirmPassword()).toBe(false);

    component.toggleConfirmPassword();
    expect(component.showOldPassword()).toBe(true);
    expect(component.showNewPassword()).toBe(true);
    expect(component.showConfirmPassword()).toBe(true);

    component.toggleOldPassword();
    expect(component.showOldPassword()).toBe(false);
    expect(component.showNewPassword()).toBe(true);
    expect(component.showConfirmPassword()).toBe(true);
  });

  it('should validate password mismatch between newPassword and confirmPassword', () => {
    component.passwordForm.patchValue({
      currentPassword: 'Current123!',
      newPassword: 'Password123!',
      confirmPassword: 'DifferentPassword!',
    });

    expect(component.passwordForm.hasError('passwordMismatch')).toBe(true);
    expect(component.passwordForm.valid).toBe(false);
  });

  it('should map Old Password to currentPassword and submit correctly', () => {
    component.passwordForm.patchValue({
      currentPassword: 'OldSecret123!',
      newPassword: 'NewSecret123!',
      confirmPassword: 'NewSecret123!',
    });

    expect(component.passwordForm.valid).toBe(true);

    component.onSubmit();

    expect(accountServiceMock.changePassword).toHaveBeenCalledWith({
      currentPassword: 'OldSecret123!',
      newPassword: 'NewSecret123!',
      confirmPassword: 'NewSecret123!',
    });

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' })
    );

    // Form should be reset after successful submission
    expect(component.passwordForm.getRawValue().currentPassword).toBe('');
    expect(component.passwordForm.getRawValue().newPassword).toBe('');
    expect(component.passwordForm.getRawValue().confirmPassword).toBe('');
  });

  it('should display error message on backend failure', () => {
    accountServiceMock.changePassword.mockReturnValue(
      throwError(() => ({ error: { message: 'Incorrect current password' } }))
    );

    component.passwordForm.patchValue({
      currentPassword: 'WrongOldPassword',
      newPassword: 'NewSecret123!',
      confirmPassword: 'NewSecret123!',
    });

    component.onSubmit();

    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        detail: 'Incorrect current password',
      })
    );
  });
});

