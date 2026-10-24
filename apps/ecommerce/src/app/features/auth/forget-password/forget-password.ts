import { Component, DestroyRef, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { userActions } from "../store/user.actions";
import { ForgetPasswordPayload } from "../models/payloads";
import { selectLoading } from "../store/user.selector";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { Button, Input, Link } from "@rose-app/ui";
import { TranslatePipe } from "@ngx-translate/core";
import { LucideChevronLeft, LucideMoveRight } from "@lucide/angular";
@Component({
  selector: "app-forget-password",
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    Input,
    Button,
    Link,
    LucideMoveRight,
    LucideChevronLeft,
  ],
  templateUrl: "./forget-password.html",
  styleUrl: "./forget-password.css",
})
export class ForgetPassword {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  email = signal<string>("");
  readonly currentStep = signal(1);
  readonly isLoading = this.store.selectSignal(selectLoading);
  readonly forgotPasswordForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    this.actions$
      .pipe(
        ofType(userActions.forgetPasswordSuccessfully),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.currentStep.set(2);
      });
  }

  submitEmail(): void {
    this.forgotPasswordForm.controls.email.markAsTouched();

    if (this.forgotPasswordForm.invalid || this.isLoading()) {
      return;
    }

    const origin = this.document.location?.origin;

    if (!origin) {
      return;
    }

    const redirectUrl = new URL(
      this.router.serializeUrl(this.router.createUrlTree(["/reset-password"])),
      origin,
    ).toString();

    const payload: ForgetPasswordPayload = {
      email: this.forgotPasswordForm.controls.email.value.trim(),
      redirectUrl,
    };

    this.store.dispatch(userActions.forgetPassword({ payload }));
    this.email.set(this.forgotPasswordForm.controls.email.value);
  }
}
