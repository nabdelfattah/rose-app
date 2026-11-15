import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCircleCheckBig } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from '@rose-app/ui';

@Component({
  selector: 'app-checkout',
  imports: [LucideCircleCheckBig, RouterLink, Button, TranslatePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {}
