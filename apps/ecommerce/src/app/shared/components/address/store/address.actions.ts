import { createActionGroup, emptyProps, props } from "@ngrx/store";
import {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "../model/address.model";

export const AddressActions = createActionGroup({
  source: "Address",
  events: {
    // Load All Addresses
    "Load Addresses": emptyProps(),
    "Load Addresses Success": props<{ addresses: Address[] }>(),
    "Load Addresses Failure": props<{ error: string }>(),

    // Load Address By ID
    "Load Address By ID": props<{ id: string }>(),
    "Load Address By ID Success": props<{ address: Address }>(),
    "Load Address By ID Failure": props<{ error: string }>(),

    // Create Address
    "Create Address": props<{ payload: CreateAddressRequest }>(),
    "Create Address Success": props<{ address: Address }>(),
    "Create Address Failure": props<{ error: string }>(),

    // Update Address
    "Update Address": props<{
      id: string;
      payload: UpdateAddressRequest;
    }>(),
    "Update Address Success": props<{ address: Address }>(),
    "Update Address Failure": props<{ error: string }>(),

    // Delete Address
    "Delete Address": props<{ id: string }>(),
    "Delete Address Success": props<{ id: string }>(),
    "Delete Address Failure": props<{ error: string }>(),

    // Select Address (Checkout)
    "Select Address": props<{ id: string }>(),
    "Clear Selected Address": emptyProps(),
  },
});
