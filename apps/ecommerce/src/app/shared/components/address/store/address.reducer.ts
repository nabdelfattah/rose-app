import { createReducer, on } from "@ngrx/store";
import { AddressActions } from "./address.actions";
import { AddressState } from "../model/address-state.model";
export const initialAddressState: AddressState = {
  addresses: [],
  selectedAddressId: null,
  loading: false,
  submitting: false,
  error: null,
};

export const addressReducer = createReducer(
  initialAddressState,

  // Get All Addresses
  on(AddressActions.loadAddresses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AddressActions.loadAddressesSuccess, (state, { addresses }) => ({
    ...state,
    addresses,
    loading: false,
  })),

  on(AddressActions.loadAddressesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Address By Id
  on(AddressActions.loadAddressByID, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AddressActions.loadAddressByIDSuccess, (state, { address }) => ({
    ...state,
    addresses: [
      ...state.addresses.filter((item) => item.id !== address.id),
      address,
    ],
    loading: false,
  })),

  on(AddressActions.loadAddressByIDFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Address
  on(AddressActions.createAddress, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(AddressActions.createAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: [...state.addresses, address],
    submitting: false,
  })),

  on(AddressActions.createAddressFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // Update Address
  on(AddressActions.updateAddress, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(AddressActions.updateAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: state.addresses.map((item) =>
      item.id === address.id ? address : item
    ),
    submitting: false,
  })),

  on(AddressActions.updateAddressFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // Delete Address
  on(AddressActions.deleteAddress, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(AddressActions.deleteAddressSuccess, (state, { id }) => ({
    ...state,
    addresses: state.addresses.filter((item) => item.id !== id),
    selectedAddressId:
      state.selectedAddressId === id ? null : state.selectedAddressId,
    submitting: false,
  })),

  on(AddressActions.deleteAddressFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // Select Address
  on(AddressActions.selectAddress, (state, { id }) => ({
    ...state,
    selectedAddressId: id,
  })),

  on(AddressActions.clearSelectedAddress, (state) => ({
    ...state,
    selectedAddressId: null,
  }))
);
