import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  output,
  DestroyRef,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import {
  LucideCamera,
  LucideTrash2,
  LucideLoaderCircle,
  LucideChevronDown,
} from '@lucide/angular';
import { AccountService } from '../../service/account.service';
import { UserProfile, UpdateProfilePayload } from '../../model/account.model';
import { Session } from '../../../../core/services/session';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    LucideCamera,
    LucideTrash2,
    LucideLoaderCircle,
    LucideChevronDown,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly session = inject(Session);
  private readonly destroyRef = inject(DestroyRef);

  readonly deleteAccountRequested = output<void>();

  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly uploading = signal<boolean>(false);
  readonly isGenderDropdownOpen = signal<boolean>(false);
  readonly profile = signal<UserProfile | null>(null);
  readonly photoUrl = signal<string | null>(null);

  readonly profileForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    gender: new FormControl<'MALE' | 'FEMALE' | ''>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.accountService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const user = res.payload.user;
          this.profile.set(user);
          this.photoUrl.set(user.photo ?? null);
          this.profileForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: (user.gender === 'MALE' || user.gender === 'FEMALE') ? user.gender : '',
          });
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? this.translateService.instant('account.profile.error'),
          });
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.translateService.instant('account.profile.photo.typeError'),
      });
      input.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.translateService.instant('account.profile.photo.sizeError'),
      });
      input.value = '';
      return;
    }

    this.uploading.set(true);
    this.accountService
      .uploadPhoto(file)
      .pipe(
        switchMap((res) =>
          this.accountService.updateProfile({ photo: res.payload.url }).pipe(
            map((updateRes) => ({ uploadUrl: res.payload.url, updateRes }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ uploadUrl, updateRes }) => {
          this.uploading.set(false);
          const updatedUser = updateRes.payload.user;
          this.photoUrl.set(updatedUser.photo || uploadUrl);
          this.profile.set(updatedUser);

          const currentSession = this.session.getUser();
          if (currentSession) {
            this.session.save({
              ...currentSession,
              profilePhoto: updatedUser.photo || uploadUrl,
            });
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translateService.instant('account.profile.photo.uploadSuccess'),
          });
          input.value = '';
        },
        error: (err) => {
          this.uploading.set(false);
          input.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err?.error?.message ??
              this.translateService.instant('account.profile.photo.uploadError'),
          });
        },
      });
  }

  selectGender(val: 'MALE' | 'FEMALE'): void {
    this.profileForm.controls.gender.setValue(val);
    this.profileForm.controls.gender.markAsDirty();
    this.isGenderDropdownOpen.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.saving()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const raw = this.profileForm.getRawValue();
    const payload: UpdateProfilePayload = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      phone: raw.phone.trim(),
    };

    const photo = this.photoUrl();
    if (photo) {
      payload.photo = photo;
    }

    // Backend Swagger confirmed: PATCH /api/users/profile does NOT accept gender or email!
    // We send ONLY the supported fields (firstName, lastName, phone, photo).
    this.saving.set(true);
    this.accountService
      .updateProfile(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          const updatedUser = res.payload.user;
          this.profile.set(updatedUser);

          const currentSession = this.session.getUser();
          if (currentSession) {
            this.session.save({
              ...currentSession,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              phone: updatedUser.phone ?? '',
              profilePhoto: updatedUser.photo ?? currentSession.profilePhoto,
              ...(raw.gender ? { gender: raw.gender } : {}),
            });
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translateService.instant('account.profile.success'),
          });
        },
        error: (err) => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? this.translateService.instant('account.profile.error'),
          });
        },
      });
  }

  onDeleteAccountClick(): void {
    this.deleteAccountRequested.emit();
  }

  getInitials(): string {
    const fn = this.profile()?.firstName || '';
    const ln = this.profile()?.lastName || '';
    const initial = (fn[0] || '') + (ln[0] || '');
    return initial.toUpperCase() || 'U';
  }
}
