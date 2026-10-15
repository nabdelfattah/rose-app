import {
  Component,
  computed,
  DestroyRef,
  inject,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { userActions } from "../store/user.actions";
import { RegisterPayload } from "../models/payloads";
import { selectLoading } from "../store/user.selector";
import { confirmPassword } from "../utils/utils";
import { passwordPattern } from "../utils/patterns";
import { Button, GenderInput, Input, LangButton, Link, ThemeButtonComponent } from "@rose-app/ui";
import { LucideMoveRight } from "@lucide/angular";
import { TranslatePipe } from "@ngx-translate/core";
import { Router, RouterLink } from "@angular/router";
import { InputOtpModule } from "@openng/optimus-ui/inputotp";
import { Stepper } from "./stepper/stepper";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Input,
    TranslatePipe,
    Button,
    LucideMoveRight,
    Link,
    InputOtpModule,
    FormsModule,
    GenderInput,
    Stepper,
    ThemeButtonComponent,
    LangButton
  ],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class Register {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  email = signal<string>("");
  otpValue = "";
  readonly currentStep = signal(1);
  readonly isLoading = this.store.selectSignal(selectLoading);

  readonly registerForm = new FormGroup(
    {
      email: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),

      firstName: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),

      lastName: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),

      username: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),

      phone: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),

      gender: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),

      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(passwordPattern)],
      }),

      rePassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [confirmPassword] },
  );

  onOtpChange(event: { value: string }): void {
    this.otpValue = event.value;
  }
  
  constructor() {
    // Move to step 2 after sending the OTP successfully
    this.actions$
      .pipe(
        ofType(userActions.verifyEmailSuccessfully),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.currentStep.set(2);
      });

    // Move to step 3 after confirming the OTP successfully
    this.actions$
      .pipe(
        ofType(userActions.confirmEmailSuccessfully),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.currentStep.set(3);
      });

    this.actions$
      .pipe(
        ofType(userActions.registerSuccessfully),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.router.navigate(["/login"]);
      });
  }

  nextStep(): void {
    switch (this.currentStep()) {
      case 1: {
        const emailControl = this.registerForm.controls.email;
        if (emailControl.invalid || this.isLoading()) {
          return;
        }

        this.store.dispatch(
          userActions.verifyEmail({
            payload: {
              email: emailControl.value,
            },
          }),
        );
        this.email.set(emailControl.value);

        break;
      }

      case 2: {
        if (this.otpValue.length !== 6 || this.isLoading()) {
          return;
        }

        this.store.dispatch(
          userActions.confirmEmail({
            payload: {
              email: this.registerForm.controls.email.value,
              code: this.otpValue,
            },
          }),
        );

        break;
      }

      case 3: {
        const aboutControls = [
          this.registerForm.controls.firstName,
          this.registerForm.controls.lastName,
          this.registerForm.controls.username,
          this.registerForm.controls.phone,
          this.registerForm.controls.gender,
        ];

        if (aboutControls.some((control) => control.invalid)) {
          return;
        }

        this.currentStep.set(4);
        break;
      }
    }
  }

  submit(): void {
    if (this.isLoading()) {
      return;
    }

    const {
      email,
      firstName,
      lastName,
      username,
      phone,
      gender,
      password,
      rePassword,
    } = this.registerForm.getRawValue();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload: RegisterPayload = {
      username: username,
      email: email,
      password: password,
      confirmPassword: rePassword,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      gender: gender,
    };
    this.store.dispatch(userActions.register({ payload }));
  }
}
