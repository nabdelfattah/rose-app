import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MessageService } from '@openng/optimus-ui/api';
import { Profile } from './profile';
import { AccountService } from '../../service/account.service';
import { Session } from '../../../../core/services/session';
import { ProfileResponse, UploadResponse } from '../../model/account.model';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      account: {
        profile: {
          success: 'Profile updated successfully.',
          error: 'Failed to update profile.',
          male: 'Male',
          female: 'Female',
          photo: {
            uploadSuccess: 'Photo uploaded successfully.',
            uploadError: 'Failed to upload photo.',
            sizeError: 'File size exceeds 5MB.',
            typeError: 'Unsupported file format.',
          },
        },
      },
    });
  }
}

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let accountServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    updateProfile: ReturnType<typeof vi.fn>;
    uploadPhoto: ReturnType<typeof vi.fn>;
  };
  let messageServiceMock: {
    add: ReturnType<typeof vi.fn>;
  };
  let sessionMock: {
    getUser: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'u-1',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+201012345678',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'MALE',
    photo: 'https://example.com/avatar.jpg',
    emailVerified: true,
    phoneVerified: true,
    role: 'USER',
  };

  const mockProfileResponse: ProfileResponse = {
    status: true,
    code: 200,
    payload: { user: mockUser },
  };

  beforeEach(async () => {
    accountServiceMock = {
      getProfile: vi.fn().mockReturnValue(of(mockProfileResponse)),
      updateProfile: vi.fn().mockReturnValue(of(mockProfileResponse)),
      uploadPhoto: vi.fn(),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    sessionMock = {
      getUser: vi.fn().mockReturnValue(mockUser),
      save: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Session, useValue: sessionMock },
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load real user profile into the form', () => {
    expect(component).toBeTruthy();
    expect(accountServiceMock.getProfile).toHaveBeenCalled();
    expect(component.profile()?.firstName).toBe('John');

    const form = component.profileForm;
    expect(form.getRawValue().firstName).toBe('John');
    expect(form.getRawValue().lastName).toBe('Doe');
    expect(form.getRawValue().email).toBe('john@example.com');
    expect(form.getRawValue().phone).toBe('+201012345678');
    expect(form.getRawValue().gender).toBe('MALE');

    // Email is read-only / disabled
    expect(form.controls.email.disabled).toBe(true);
    // Gender is selectable (interactive)
    expect(form.controls.gender.disabled).toBe(false);
  });

  it('should allow selecting gender between Male and Female', () => {
    expect(component.profileForm.controls.gender.value).toBe('MALE');

    component.selectGender('FEMALE');
    expect(component.profileForm.controls.gender.value).toBe('FEMALE');
    expect(component.isGenderDropdownOpen()).toBe(false);

    component.selectGender('MALE');
    expect(component.profileForm.controls.gender.value).toBe('MALE');
  });

  it('should submit only supported fields (firstName, lastName, phone, photo) and NOT email or gender', () => {
    component.profileForm.patchValue({
      firstName: 'Jonathan',
      lastName: 'Smith',
      phone: '+201099999999',
      gender: 'FEMALE',
    });

    component.saveProfile();

    expect(accountServiceMock.updateProfile).toHaveBeenCalledWith({
      firstName: 'Jonathan',
      lastName: 'Smith',
      phone: '+201099999999',
      photo: 'https://example.com/avatar.jpg',
    });

    const callPayload = accountServiceMock.updateProfile.mock.calls[0][0];
    expect(callPayload.email).toBeUndefined();
    expect(callPayload.gender).toBeUndefined();
  });

  it('should validate file upload type and reject non-image files', () => {
    const invalidFile = new File(['text'], 'doc.pdf', { type: 'application/pdf' });
    const event = {
      target: {
        files: [invalidFile],
        value: 'doc.pdf',
      },
    } as unknown as Event;

    component.onFileSelected(event);

    expect(accountServiceMock.uploadPhoto).not.toHaveBeenCalled();
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' })
    );
  });

  it('should validate file upload size and reject files larger than 5MB', () => {
    const largeFile = new File(['x'.repeat(100)], 'huge.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    const event = {
      target: {
        files: [largeFile],
        value: 'huge.png',
      },
    } as unknown as Event;

    component.onFileSelected(event);

    expect(accountServiceMock.uploadPhoto).not.toHaveBeenCalled();
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' })
    );
  });

  it('should upload valid image file via POST /api/upload and immediately PATCH /api/users/profile with photo URL', () => {
    const validFile = new File(['image-bytes'], 'avatar.png', { type: 'image/png' });
    const uploadRes: UploadResponse = {
      status: true,
      code: 201,
      payload: { url: '/api/upload/temp/new-photo-uuid' },
    };
    const updatedUserRes: ProfileResponse = {
      status: true,
      code: 200,
      payload: { user: { ...mockUser, photo: '/api/upload/temp/new-photo-uuid' } },
    };

    accountServiceMock.uploadPhoto.mockReturnValue(of(uploadRes));
    accountServiceMock.updateProfile.mockReturnValue(of(updatedUserRes));

    const event = {
      target: {
        files: [validFile],
        value: 'avatar.png',
      },
    } as unknown as Event;

    component.onFileSelected(event);

    // 1. Upload photo called with FormData containing file
    expect(accountServiceMock.uploadPhoto).toHaveBeenCalledWith(validFile);
    // 2. Profile patched with photo url
    expect(accountServiceMock.updateProfile).toHaveBeenCalledWith({
      photo: '/api/upload/temp/new-photo-uuid',
    });
    // 3. photoUrl signal updated
    expect(component.photoUrl()).toBe('/api/upload/temp/new-photo-uuid');
    // 4. Session updated
    expect(sessionMock.save).toHaveBeenCalled();
    // 5. Success toast
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' })
    );
  });

  it('should emit deleteAccountRequested when Delete My Account is clicked', () => {
    const spy = vi.fn();
    component.deleteAccountRequested.subscribe(spy);

    component.onDeleteAccountClick();

    expect(spy).toHaveBeenCalled();
  });
});
