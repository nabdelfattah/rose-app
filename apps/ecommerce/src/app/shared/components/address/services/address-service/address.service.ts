import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Address,
  AddressesResponse,
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
  DeleteAddressResponse,
} from "../../model/address.model";
import { BASE_URL } from "../../../../../core/constants/apiUrl";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${BASE_URL}/addresses`;

  getAddresses(): Observable<AddressesResponse> {
    return this.httpClient.get<AddressesResponse>(this.apiUrl);
  }

  getAddressById(id: string): Observable<AddressResponse> {
    return this.httpClient.get<AddressResponse>(`${this.apiUrl}/${id}`);
  }

  createAddress(payload: CreateAddressRequest): Observable<AddressResponse> {
    return this.httpClient.post<AddressResponse>(this.apiUrl, payload);
  }

  updateAddress(id: string, payload: UpdateAddressRequest): Observable<AddressResponse> {
    return this.httpClient.patch<AddressResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAddress(id: string): Observable<DeleteAddressResponse> {
    return this.httpClient.delete<DeleteAddressResponse>(`${this.apiUrl}/${id}`);
  }
}
