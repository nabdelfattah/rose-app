import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../core/constants/apiUrl';
import {
  ProfileResponse,
  UpdateProfilePayload,
  UploadResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from '../model/account.model';

@Injectable()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly profileUrl = `${BASE_URL}/users/profile`;
  private readonly uploadUrl = `${BASE_URL}/upload`;
  private readonly changePasswordUrl = `${BASE_URL}/users/change-password`;
  private readonly accountUrl = `${BASE_URL}/users/account`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.profileUrl);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(this.profileUrl, payload);
  }

  uploadPhoto(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(this.uploadUrl, formData);
  }

  changePassword(payload: ChangePasswordPayload): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(this.changePasswordUrl, payload);
  }

  deleteAccount(): Observable<unknown> {
    return this.http.delete<unknown>(this.accountUrl);
  }
}

