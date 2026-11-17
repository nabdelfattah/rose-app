import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NotificationsService } from "./notifications.service";
import { environment } from "../../../../environments/environment";
import {
  DeleteNotificationRes,
  MarkAsReadRes,
  Notification,
  NotificationRes,
  UnReadCountRes,
} from "../model/notifications";

const BASE = `${environment.baseUrl}notifications`;

const mockNotification: Notification = {
  id: "n-1",
  userId: "user-1",
  type: "ORDER",
  title: "Order shipped",
  message: "Your order is on the way",
  isRead: false,
  link: "/orders/1",
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
};

const mockDeleteRes: DeleteNotificationRes = {
  status: true,
  code: 200,
  message: "success",
  payload: "ok",
};

describe("NotificationsService", () => {
  let service: NotificationsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NotificationsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // fails the test if a request was sent that no test expected
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getNotifications() should GET /notifications", () => {
    const mockRes: NotificationRes = {
      status: true,
      code: 200,
      message: "success",
      payload: {
        data: [mockNotification],
        metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    };
    let result: NotificationRes | undefined;
    service.getNotifications().subscribe((res) => (result = res));
    const req = httpTesting.expectOne(BASE);
    expect(req.request.method).toBe("GET");
    req.flush(mockRes);

    expect(result).toEqual(mockRes);
  });

  it("getUnreadCount() should GET /notifications/unread-count", () => {
    const mockRes: UnReadCountRes = {
      status: true,
      code: 200,
      payload: { unreadCount: 3 },
    };
    let result: UnReadCountRes | undefined;
    service.getUnreadCount().subscribe((res) => (result = res));
    const req = httpTesting.expectOne(`${BASE}/unread-count`);
    expect(req.request.method).toBe("GET");
    req.flush(mockRes);

    expect(result?.payload.unreadCount).toBe(3);
  });

  it("markAsRead() should PATCH /notifications/:id with {isRead: true}", () => {
    const mockRes: MarkAsReadRes = {
      status: true,
      code: 200,
      payload: { notification: { ...mockNotification, isRead: true } },
    };
    let result: MarkAsReadRes | undefined;
    service.markAsRead("n-1").subscribe((res) => (result = res));
    const req = httpTesting.expectOne(`${BASE}/n-1`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual({ isRead: true });
    req.flush(mockRes);

    expect(result?.payload.notification.isRead).toBe(true);
  });

  it("markAllRead() should PATCH /notifications/mark-all-read", () => {
    let result: DeleteNotificationRes | undefined;
    service.markAllRead().subscribe((res) => (result = res));
    const req = httpTesting.expectOne(`${BASE}/mark-all-read`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual({});
    req.flush(mockDeleteRes);

    expect(result).toEqual(mockDeleteRes);
  });

  it("deleteNotification() should DELETE /notifications/:id", () => {
    let result: DeleteNotificationRes | undefined;
    service.deleteNotification("n-1").subscribe((res) => (result = res));
    const req = httpTesting.expectOne(`${BASE}/n-1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(mockDeleteRes);

    expect(result).toEqual(mockDeleteRes);
  });

  it("clearNotifications() should DELETE /notifications/clear-all", () => {
    let result: DeleteNotificationRes | undefined;
    service.clearNotifications().subscribe((res) => (result = res));
    const req = httpTesting.expectOne(`${BASE}/clear-all`);
    expect(req.request.method).toBe("DELETE");
    req.flush(mockDeleteRes);

    expect(result).toEqual(mockDeleteRes);
  });
});
