import { inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  catchError,
  map,
  of,
  switchMap,
  exhaustMap,
  concatMap,
  tap,
} from "rxjs";

import { AddressService } from "../services/address-service/address.service";
import { AddressActions } from "./address.actions";
import { MessageService } from "@openng/optimus-ui/api";
import { TranslateService } from "@ngx-translate/core";

// GET ALL ADDRESSES
export const loadAddresses = createEffect(
  (actions$ = inject(Actions), addressService = inject(AddressService)) =>
    actions$.pipe(
      ofType(AddressActions.loadAddresses),
      switchMap(() =>
        addressService.getAddresses().pipe(
          map((response) =>
            AddressActions.loadAddressesSuccess({
              addresses: response.payload.addresses,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AddressActions.loadAddressesFailure({
                error: getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// GET ADDRESS BY ID
export const loadAddressById = createEffect(
  (actions$ = inject(Actions), addressService = inject(AddressService)) =>
    actions$.pipe(
      ofType(AddressActions.loadAddressByID),
      switchMap(({ id }) =>
        addressService.getAddressById(id).pipe(
          map((response) =>
            AddressActions.loadAddressByIDSuccess({
              address: response.payload.address,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AddressActions.loadAddressByIDFailure({
                error: getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// CREATE ADDRESS
export const createAddress = createEffect(
  (actions$ = inject(Actions), addressService = inject(AddressService)) =>
    actions$.pipe(
      ofType(AddressActions.createAddress),
      exhaustMap(({ payload }) =>
        addressService.createAddress(payload).pipe(
          map((response) =>
            AddressActions.createAddressSuccess({
              address: response.payload.address,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AddressActions.createAddressFailure({
                error: getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// UPDATE ADDRESS
export const updateAddress = createEffect(
  (actions$ = inject(Actions), addressService = inject(AddressService)) =>
    actions$.pipe(
      ofType(AddressActions.updateAddress),
      concatMap(({ id, payload }) =>
        addressService.updateAddress(id, payload).pipe(
          map((response) =>
            AddressActions.updateAddressSuccess({
              address: response.payload.address,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              AddressActions.updateAddressFailure({
                error: getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// DELETE ADDRESS
export const deleteAddress = createEffect(
  (actions$ = inject(Actions), addressService = inject(AddressService)) =>
    actions$.pipe(
      ofType(AddressActions.deleteAddress),
      concatMap(({ id }) =>
        addressService.deleteAddress(id).pipe(
          map(() => AddressActions.deleteAddressSuccess({ id })),
          catchError((error: HttpErrorResponse) =>
            of(
              AddressActions.deleteAddressFailure({
                error: getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Success Toast
export const addressSuccessToast = createEffect(
  (
    actions$ = inject(Actions),
    messageService = inject(MessageService),
    translate = inject(TranslateService),
  ) =>
    actions$.pipe(
      ofType(
        AddressActions.createAddressSuccess,
        AddressActions.updateAddressSuccess,
        AddressActions.deleteAddressSuccess,
      ),
      tap((action) => {
        const messages = {
          [AddressActions.createAddressSuccess.type]: "address.toast.created",
          [AddressActions.updateAddressSuccess.type]: "address.toast.updated",
          [AddressActions.deleteAddressSuccess.type]: "address.toast.deleted",
        };

        messageService.add({
          severity: "success",
          summary: translate.instant("address.toast.success"),
          detail: translate.instant(messages[action.type]),
          life: 3000,
        });
      }),
    ),
  { functional: true, dispatch: false },
);

// Failure Toast
export const addressFailureToast = createEffect(
  (
    actions$ = inject(Actions),
    messageService = inject(MessageService),
    translate = inject(TranslateService),
  ) =>
    actions$.pipe(
      ofType(
        AddressActions.loadAddressesFailure,
        AddressActions.loadAddressByIDFailure,
        AddressActions.createAddressFailure,
        AddressActions.updateAddressFailure,
        AddressActions.deleteAddressFailure,
      ),
      tap((action) => {
        const messages = {
          [AddressActions.loadAddressesFailure.type]:
            "address.toast.loadFailed",
          [AddressActions.loadAddressByIDFailure.type]:
            "address.toast.loadByIdFailed",
          [AddressActions.createAddressFailure.type]:
            "address.toast.createFailed",
          [AddressActions.updateAddressFailure.type]:
            "address.toast.updateFailed",
          [AddressActions.deleteAddressFailure.type]:
            "address.toast.deleteFailed",
        };

        messageService.add({
          severity: "error",
          summary: translate.instant("address.toast.error"),
          detail: translate.instant(messages[action.type]),
          life: 4000,
        });
      }),
    ),
  { functional: true, dispatch: false },
);

// Error Handler
function getErrorMessage(error: HttpErrorResponse): string {
  return error.error?.message ?? error.message ?? "Something went wrong";
}
