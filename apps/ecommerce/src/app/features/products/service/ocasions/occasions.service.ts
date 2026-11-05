import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../core/constants/apiUrl';
import { OccasionRes } from '../../model/occasions';

@Injectable({
  providedIn: 'root',
})
export class OccasionsService{
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${BASE_URL}/occasions`

    getOccasions():Observable<OccasionRes>{
      return this.httpClient.get<OccasionRes>(this.apiUrl);
    }
}