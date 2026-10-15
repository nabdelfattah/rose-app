import { Component, DestroyRef, inject } from "@angular/core";
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { userActions } from "../store/user.actions";
import { ResetPasswordPayload } from "../models/payloads";
import { selectLoading } from "../store/user.selector";
import { confirmPassword } from "../utils/utils";
import { Button, Input, LangButton, ThemeButtonComponent } from "@rose-app/ui";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, Button, Input, TranslatePipe, ThemeButtonComponent, LangButton],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(selectLoading);

  readonly token = this.route.snapshot.queryParamMap.get("token") ?? "";

  readonly resetPasswordForm = new FormGroup(
    {
      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      rePassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [confirmPassword] },
  );

  constructor() {
    this.actions$
      .pipe(
        ofType(userActions.resetPasswordSuccessfully),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.router.navigate(["/login"]);
      });
  }

  submit(): void {
    this.resetPasswordForm.markAllAsTouched();
    if (
      this.resetPasswordForm.invalid ||
      this.isLoading() ||
      !this.token
    ) {
      return;
    }

    const { password, rePassword } =
      this.resetPasswordForm.getRawValue();

    const payload: ResetPasswordPayload = {
      token: this.token,
      newPassword: password,
      confirmPassword: rePassword,
    };

    this.store.dispatch(userActions.resetPassword({ payload }));
  }
}
