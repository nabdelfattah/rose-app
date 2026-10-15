import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.html',
})
export class Stepper {
  currentStep = input.required<number>();
  totalSteps = input(4);

  steps = computed(() =>
    Array.from({ length: this.totalSteps() }, (_, i) => i + 1),
  );
}