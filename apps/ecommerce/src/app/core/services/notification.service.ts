import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface NotificationItem {
  _id?: string;
  id?: string;
  title: string;
  message?: string;
  body?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationListResponse {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: {
    data?: NotificationItem[];
    metadata?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  };
}

export interface UnreadCountResponse {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: {
    count?: number;
    unreadCount?: number;
  } | number;
  count?: number;
  unreadCount?: number;
}

@Injectable()
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rose-app.elevate-bootcamp.cloud/api/notifications';

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationListResponse>(this.baseUrl).pipe(
      map((res) => res?.payload?.data ?? []),
      catchError((err) => {
        console.error('Failed to load notifications', err);
        return of([]);
      })
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`).pipe(
      map((res) => {
        if (typeof res?.payload === 'number') {
          return res.payload;
        }
        if (res?.payload?.unreadCount !== undefined) {
          return res.payload.unreadCount;
        }
        if (res?.payload?.count !== undefined) {
          return res.payload.count;
        }
        if (typeof res?.unreadCount === 'number') {
          return res.unreadCount;
        }
        if (typeof res?.count === 'number') {
          return res.count;
        }
        return 0;
      }),
      catchError((err) => {
        console.error('Failed to get unread count', err);
        return of(0);
      })
    );
  }

  markAllAsRead(): Observable<boolean> {
    return this.http.patch(`${this.baseUrl}/mark-all-read`, {}).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Failed to mark all notifications as read', err);
        return of(false);
      })
    );
  }

  clearAll(): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/clear-all`).pipe(
      map(() => true),
      catchError((err) => {
        console.error('Failed to clear all notifications', err);
        return of(false);
      })
    );
  }

  markAsRead(id: string): Observable<boolean> {
    return this.http.patch(`${this.baseUrl}/${id}`, { isRead: true }).pipe(
      map(() => true),
      catchError((err) => {
        console.error(`Failed to mark notification ${id} as read`, err);
        return of(false);
      })
    );
  }

  deleteNotification(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true),
      catchError((err) => {
        console.error(`Failed to delete notification ${id}`, err);
        return of(false);
      })
    );
  }
}
