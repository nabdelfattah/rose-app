import { Address } from "./address.model";
export interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}
