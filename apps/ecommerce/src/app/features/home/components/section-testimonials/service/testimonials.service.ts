import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../../../../../core/constants/apiUrl';
import { Observable } from 'rxjs';
import { TestimonialRes } from '../model/testimonials.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${BASE_URL}/testimonials`

    getTestimonials():Observable<TestimonialRes>{
        return this.httpClient.get<TestimonialRes>(this.apiUrl);
    }
}