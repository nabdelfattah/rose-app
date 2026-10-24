import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { userActions } from "../store/user.actions";
import { TranslatePipe } from "@ngx-translate/core";
import { Button, Input, Link, AuthHeading } from "@rose-app/ui";
import { selectLoading } from "../store/user.selector";

@Component({
  selector: "app-login",
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    Link,
    Button,
    Input,
    AuthHeading,
  ],
  templateUrl: "./login.html",
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  isLoading = this.store.selectSignal(selectLoading);

  loginForm = this.fb.nonNullable.group({
    username: ["", [Validators.required, Validators.minLength(3)]],
    password: ["", [Validators.required]],
    rememberMe: [false], // checked => keep the session cookies for 90 days instead of until the browser closes
  });

  submitHandler() {
    if (this.loginForm.valid) {
      // send request to backend, display toast, set token and redirect to home
      const { rememberMe, ...payload } = this.loginForm.getRawValue();
      this.store.dispatch(userActions.login({ payload, rememberMe }));
    } else {
      // show all problematic fields
      this.loginForm.markAllAsTouched();
    }
  }
}
