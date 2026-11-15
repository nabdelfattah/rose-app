import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  private promise?: Promise<void>;

  load(apiKey: string): Promise<void> {
    if ((window as any).google?.maps) return Promise.resolve();
    if (this.promise) return this.promise;

    this.promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.promise = undefined;
        reject(new Error('Failed to load Google Maps'));
      };
      document.head.appendChild(script);
    });

    return this.promise;
  }
}