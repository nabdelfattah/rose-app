import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-trusted-companies',
  standalone: true,
  imports: [],
  templateUrl: './trusted-companies.html',
  styleUrl: './trusted-companies.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedCompanies {
  readonly logos = [
    { src: 'images/companies/image 36.svg', alt: 'coconut' },
    { src: 'images/companies/image 37.svg', alt: 'ginyard' },
    { src: 'images/companies/image 38.svg', alt: 'Ingoude company' },
    { src: 'images/companies/image 39.svg', alt: 'velvet' },
    { src: 'images/companies/image 40.svg', alt: 'ingoude' },
    { src: 'images/companies/image 41.svg', alt: 'habux' },
  ];
}
