import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AccountService } from './account.service';
import { BASE_URL } from '../../../core/constants/apiUrl';
import { ProfileResponse, UploadResponse, ChangePasswordResponse } from '../model/account.model';

describe('AccountService', () => {
  let service: AccountService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AccountService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user profile with GET /api/users/profile', () => {
    const mockRes: ProfileResponse = {
      status: true,
      code: 200,
      payload: {
        user: {
          id: 'user-1',
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
        },
      },
    };

    service.getProfile().subscribe((res) => {
      expect(res.payload.user.firstName).toBe('John');
    });

    const req = httpTesting.expectOne(`${BASE_URL}/users/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRes);
  });

  it('should patch user profile with PATCH /api/users/profile', () => {
    const payload = { firstName: 'Jane', lastName: 'Doe', phone: '+201098765432' };

    service.updateProfile(payload).subscribe();

    const req = httpTesting.expectOne(`${BASE_URL}/users/profile`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush({ status: true, code: 200, payload: { user: {} } });
  });

  it('should upload photo with POST /api/upload', () => {
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    const mockUpload: UploadResponse = {
      status: true,
      code: 201,
      payload: { url: '/api/upload/temp/123' },
    };

    service.uploadPhoto(file).subscribe((res) => {
      expect(res.payload.url).toBe('/api/upload/temp/123');
    });

    const req = httpTesting.expectOne(`${BASE_URL}/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.has('image')).toBe(true);
    req.flush(mockUpload);
  });

  it('should change password with POST /api/users/change-password', () => {
    const payload = {
      currentPassword: 'old',
      newPassword: 'new',
      confirmPassword: 'new',
    };
    const mockRes: ChangePasswordResponse = { status: true, message: 'Password changed' };

    service.changePassword(payload).subscribe((res) => {
      expect(res.status).toBe(true);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/users/change-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockRes);
  });

  it('should delete account with DELETE /api/users/account', () => {
    service.deleteAccount().subscribe();

    const req = httpTesting.expectOne(`${BASE_URL}/users/account`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

