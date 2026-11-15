export interface Notification {
  id: string;
  userId: string;
  type: "ORDER";
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRes {
  status: boolean;
  code: number;
  message: string;
  payload: {
    data: Notification[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface NotificationErr {
  status: boolean;
  code: number;
  message: string;
  errors: [
    {
      path: string;
      message: string;
      messages: string[];
    },
  ];
}

export interface UnReadCountRes {
  status: boolean;
  code: number;
  payload: {
    unreadCount: number;
  };
}
export interface MarkAsReadRes {
  status: boolean;
  code: number;
  payload: {
    notification: Notification;
  };
}
export interface DeleteNotificationRes {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}
