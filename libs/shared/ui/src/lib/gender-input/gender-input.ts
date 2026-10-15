import { LucideChevronDown, LucideChevronUp } from '@lucide/angular';
import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gender-input',
  imports: [ReactiveFormsModule, TranslatePipe, LucideChevronDown, LucideChevronUp],
  templateUrl: './gender-input.html',
})
export class GenderInput {
  label = input<string>('auth.register.about.gender');
  id = input.required<string>();
  placeholder = input<string>('auth.register.about.select-gender');
  control = input.required<FormControl>();
  isOpen = signal(false);

  selectGender(value: 'MALE' | 'FEMALE'): void {
  this.control().setValue(value);
  this.control().markAsTouched();
  this.control().markAsDirty();
  this.isOpen.set(false);
}
}
