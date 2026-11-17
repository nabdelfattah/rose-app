import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import {
  DeleteNotificationRes,
  MarkAsReadRes,
  NotificationRes,
  UnReadCountRes,
} from "../model/notifications";
import { environment } from "../../../../environments/environment";

@Service()
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(): Observable<NotificationRes> {
    return this.httpClient.get<NotificationRes>(
      `${environment.baseUrl}notifications`,
    );
  }

  getUnreadCount(): Observable<UnReadCountRes> {
    return this.httpClient.get<UnReadCountRes>(
      `${environment.baseUrl}notifications/unread-count`,
    );
  }

  markAsRead(id: string): Observable<MarkAsReadRes> {
    return this.httpClient.patch<MarkAsReadRes>(
      `${environment.baseUrl}notifications/${id}`,
      { isRead: true },
    );
  }

  markAllRead(): Observable<DeleteNotificationRes> {
    return this.httpClient.patch<DeleteNotificationRes>(
      `${environment.baseUrl}notifications/mark-all-read`,
      {},
    );
  }

  deleteNotification(id: string): Observable<DeleteNotificationRes> {
    return this.httpClient.delete<DeleteNotificationRes>(
      `${environment.baseUrl}notifications/${id}`,
    );
  }

  clearNotifications(): Observable<DeleteNotificationRes> {
    return this.httpClient.delete<DeleteNotificationRes>(
      `${environment.baseUrl}notifications/clear-all`,
    );
  }
}
