import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { LucideEye, LucideEyeOff, LucideLoaderCircle } from '@lucide/angular';
import { AccountService } from '../../service/account.service';
import { ChangePasswordPayload } from '../../model/account.model';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const newPass = control.get('newPassword')?.value;
  const confirmPass = control.get('confirmPassword')?.value;
  if (newPass && confirmPass && newPass !== confirmPass) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideEye,
    LucideEyeOff,
    LucideLoaderCircle,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword {
  private readonly accountService = inject(AccountService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal<boolean>(false);
  readonly showOldPassword = signal<boolean>(false);
  readonly showNewPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator }
  );

  toggleOldPassword(): void {
    this.showOldPassword.update((v) => !v);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || this.submitting()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const raw = this.passwordForm.getRawValue();
    const payload: ChangePasswordPayload = {
      currentPassword: raw.currentPassword,
      newPassword: raw.newPassword,
      confirmPassword: raw.confirmPassword,
    };

    this.submitting.set(true);
    this.accountService
      .changePassword(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res?.message ?? this.translateService.instant('account.password.success'),
          });
          this.passwordForm.reset();
        },
        error: (err) => {
          this.submitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? this.translateService.instant('account.password.error'),
          });
        },
      });
  }
}

