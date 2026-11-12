import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AddressState } from "../model/address-state.model";

export const selectAddressState =
  createFeatureSelector<AddressState>("address");

// All Addresses
export const selectAddresses = createSelector(
  selectAddressState,
  (state) => state.addresses
);

// Selected Address ID
export const selectSelectedAddressId = createSelector(
  selectAddressState,
  (state) => state.selectedAddressId
);

// Selected Address Object
export const selectSelectedAddress = createSelector(
  selectAddresses,
  selectSelectedAddressId,
  (addresses, selectedId) =>
    addresses.find((address) => address.id === selectedId) ?? addresses[0]
);

// Loading
export const selectAddressLoading = createSelector(
  selectAddressState,
  (state) => state.loading
);

// Submitting
export const selectAddressSubmitting = createSelector(
  selectAddressState,
  (state) => state.submitting
);

// Error
export const selectAddressError = createSelector(
  selectAddressState,
  (state) => state.error
);

// Primary Address
export const selectPrimaryAddress = createSelector(
  selectAddresses,
  (addresses) => addresses.find((address) => address.isPrimary) ?? null
);

// Address Count
export const selectAddressCount = createSelector(
  selectAddresses,
  (addresses) => addresses.length
);
