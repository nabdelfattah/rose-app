import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gender-input',
  imports: [ReactiveFormsModule],
  templateUrl: './gender-input.html',
})
export class GenderInput {
  label = input<string>('Gender');
  id = input.required<string>();
  placeholder = input<string>('Select Gender');
  control = input.required<FormControl>();
}
