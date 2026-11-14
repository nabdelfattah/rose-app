import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ConfirmDialog } from '@openng/optimus-ui/confirmdialog';
import {
  LucideUser,
  LucideLock,
  LucideLogOut,
  LucideTrash2,
  LucideX,
} from '@lucide/angular';
import { userActions } from '../auth/store/user.actions';
import { AccountService } from './service/account.service';
import { Profile } from './components/profile/profile';
import { ChangePassword } from './components/change-password/change-password';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    TranslatePipe,
    ConfirmDialog,
    Profile,
    ChangePassword,
    LucideUser,
    LucideLock,
    LucideLogOut,
    LucideTrash2,
    LucideX,
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly accountService = inject(AccountService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeTab = signal<'profile' | 'password'>('profile');
  readonly deletingAccount = signal<boolean>(false);

  selectTab(tab: 'profile' | 'password'): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.store.dispatch(userActions.logout());
  }

  onDeleteAccountRequested(): void {
    this.confirmationService.confirm({
      key: 'deleteAccount',
      accept: () => {
        this.confirmDeleteAccount();
      },
    });
  }

  confirmDeleteAccount(): void {
    this.deletingAccount.set(true);
    this.accountService
      .deleteAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingAccount.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translateService.instant('account.deleteModal.success'),
          });
          // Logout resets cookies, cart, and redirects to /login
          this.logout();
        },
        error: (err) => {
          this.deletingAccount.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? this.translateService.instant('account.deleteModal.error'),
          });
        },
      });
  }
}
