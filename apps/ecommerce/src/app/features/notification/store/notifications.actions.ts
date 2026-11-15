import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Notification } from "../model/notifications";

export const notificationsActions = createActionGroup({
  source: "notifications",
  events: {
    // GET
    // Component => Effect
    "Load Notifications": emptyProps(),
    // Effect => reducer (the API result)
    "Load Notifications Success": props<{
      notifications: Notification[];
    }>(),
    // Effect => reducer (the API error)
    "Load Notifications Failure": props<{
      error: string;
    }>(),

    // GET unread count
    // Component => Effect
    "Get Count": emptyProps(),
    // Effect => reducer (the API result)
    "Get Count Success": props<{
      count: number;
    }>(),
    // Effect => reducer (the API error)
    "Get Count Failure": props<{
      error: string;
    }>(),

    // PATCH ONE
    // Component => Effect
    "Edit Item": props<{ id: string }>(),
    // Effect => reducer (the API result)
    "Edit Item Success": props<{ notification: Notification }>(),
    // Effect => reducer (the API result)
    "Edit Item Fail": props<{ error: string }>(),

    // PATCH BLUK
    // Component => Effect
    "Edit All": emptyProps(),
    // Effect => reducer (the API result)
    "Edit All Success": emptyProps(),
    // Effect => reducer (the API result)
    "Edit All Fail": props<{ error: string }>(),

    // DELETE ONE
    // Component => Effect
    "Delete Item": props<{ id: string }>(),
    // Effect => reducer (the API result)
    "Delete Item Success": props<{ id: string }>(),
    // Effect => reducer (the API result)
    "Delete Item Fail": props<{ error: string }>(),

    // DELETE BULK
    // Component => Effect
    "Delete Bulk": emptyProps(),
    // Effect => reducer (the API result)
    "Delete Bulk Success": emptyProps(),
    // Effect => reducer (the API result)
    "Delete Bulk Fail": props<{ error: string }>(),
  },
});
