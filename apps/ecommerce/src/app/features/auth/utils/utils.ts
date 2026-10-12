import { AbstractControl } from '@angular/forms';

export function confirmPassword(group: AbstractControl) {
  const password = group.get('password')?.value;
  const rePassword = group.get('rePassword')?.value;

  if (rePassword !== password && rePassword !== '') {
    // put error to the form control (rePassword)
    group.get('rePassword')?.setErrors({ mismatch: true });

    // put error to the form itself
    return { mismatch: true };
  } else {
    return null;
  }
}
