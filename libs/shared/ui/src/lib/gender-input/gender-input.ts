import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gender-input',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './gender-input.html',
})
export class GenderInput {
  label = input<string>('auth.register.about.gender');
  id = input.required<string>();
  placeholder = input<string>('auth.register.about.select-gender');
  control = input.required<FormControl>();
}
