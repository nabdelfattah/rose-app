import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { passwordPattern } from "../utils/patterns";
import { Store } from "@ngrx/store";
import { userActions } from "../store/user.actions";
import { TranslatePipe } from "@ngx-translate/core";
import { Button, Input, Link, AuthHeading, LangButton } from "@rose-app/ui";
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
    LangButton,
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
  });

  submitHandler() {
    if (this.loginForm.valid) {
      // send request to backend, display toast, set token and redirect to home
      this.store.dispatch(
        userActions.login({ payload: this.loginForm.getRawValue() }),
      );
    } else {
      // show all problematic fields
      this.loginForm.markAllAsTouched();
    }
  }
}
