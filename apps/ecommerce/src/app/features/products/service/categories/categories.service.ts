import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../core/constants/apiUrl';
import { CategoryRes } from '../../model/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${BASE_URL}/categories`;

  getCategories(): Observable<CategoryRes> {
    const params = new HttpParams()
      .set('page', 1)
      .set('limit', 100);

    return this.httpClient.get<CategoryRes>(this.apiUrl, { params });
  }
}