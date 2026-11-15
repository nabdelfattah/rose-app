import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-payment-stepper',
  imports: [],
  templateUrl: './payment-stepper.html',
  styleUrl: './payment-stepper.css'
})
export class PaymentStepper {

  steps = input(2);
  current = input(1);


  stepsArray = computed(() => Array.from({ length: this.steps() }, (_, i) => i + 1));
  progress = computed(() => {
  const total = this.steps();
  const current = this.current();
  if (current >= total) return 100;
  return ((current - 0.5) / total) * 100;
});;
}
