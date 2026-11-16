import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, filter, map, of, tap } from "rxjs";

import * as OrdersActions from "./orders.actions";
import { OrdersService } from "../services/orders.service";
import { CartActions } from "../../cart/store/cart.actions";
import { Router } from "@angular/router";
import { MessageService } from "@openng/optimus-ui/api";
import { TranslateService } from "@ngx-translate/core";

export const createOrderEffect = createEffect(
  (actions$ = inject(Actions), orderService = inject(OrdersService)) =>
    actions$.pipe(
      ofType(OrdersActions.createOrder),

      exhaustMap(({ payload }) =>
        orderService.createOrder(payload).pipe(
          map((response) =>
            OrdersActions.createOrderSuccess({
              response,
              paymentMethod: payload.paymentMethod,
            }),
          ),

          catchError((error) =>
            of(
              OrdersActions.createOrderFailure({
                error:
                  error.error?.message ??
                  error.message ??
                  "Something went wrong",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const redirectToStripeEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(OrdersActions.createOrderSuccess),

      tap(({ response, paymentMethod }) => {
        if (paymentMethod === "CREDIT_CARD") {
          window.location.href = response.payload.checkout.checkoutUrl;
        }
      }),
    ),
  { functional: true, dispatch: false },
);

export const clearCartAfterCashOrder = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(OrdersActions.createOrderSuccess),

      filter(({ paymentMethod }) => paymentMethod === "CASH_ON_DELIVERY"),

      map(({ response }) =>
        CartActions.clearCart({
          source: "order",
          orderId: response.payload.order.id,
        }),
      ),
    ),
  { functional: true },
);

export const navigateToOrderSuccess = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(CartActions.clearCartSuccess),
      filter(({ source }) => source === "order"),
      tap(() => {
        void router.navigate(["/checkout/success"]);
      }),
    ),
  { functional: true, dispatch: false },
);

export const cashOrderSuccessToast = createEffect(
  (
    actions$ = inject(Actions),
    messageService = inject(MessageService),
    translate = inject(TranslateService),
  ) =>
    actions$.pipe(
      ofType(OrdersActions.createOrderSuccess),
      filter(({ paymentMethod }) => paymentMethod === "CASH_ON_DELIVERY"),
      tap(() => {
        messageService.add({
          severity: "success",
          summary: translate.instant("orders.toast.success"),
          detail: translate.instant("orders.toast.created"),
          life: 3000,
        });
      }),
    ),
  { functional: true, dispatch: false },
);

export const orderFailureToast = createEffect(
  (
    actions$ = inject(Actions),
    messageService = inject(MessageService),
    translate = inject(TranslateService),
  ) =>
    actions$.pipe(
      ofType(OrdersActions.createOrderFailure),
      tap(({ error }) => {
        messageService.add({
          severity: "error",
          summary: translate.instant("orders.toast.error"),
          detail: error,
          life: 3000,
        });
      }),
    ),
  { functional: true, dispatch: false },
);
