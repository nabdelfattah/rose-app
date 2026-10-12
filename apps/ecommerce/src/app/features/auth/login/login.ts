import { Component, inject, signal } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@nabdelfattah/ngx-iam-auth";
import { MessageService } from "@openng/optimus-ui/api";
import { Router } from "@angular/router";
import { TOKEN_KEY, USER_KEY } from "../../../core/constants/storage-keys";

// at least 8 chars, 1 uppercase, 1 lowercase, 1 number and 1 special char
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

@Component({
  selector: "app-login",
  imports: [],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  errMsg = signal("Something Went Wrong!");

  displayToast = signal(false);
  loginForm = this.fb.nonNullable.group({
    username: ["", [Validators.required, Validators.minLength(3)]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
  });

  submitHandler() {
    if (this.loginForm.valid) {
      // send request to backend
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            detail: "You logged in successfully!",
          });
          // store token and user data
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(
            USER_KEY,
            JSON.stringify({
              username: res.username,
              email: res.email,
              phone: res.phone,
              firstName: res.firstName,
              lastName: res.lastName,
              profilePhoto: res.profilePhoto,
              role: res.role,
            }),
          );

          // redirect to home
          this.router.navigate(["/"]);
        },
        error: (err) => {
          this.errMsg.set(err.error?.message ?? "Something Went Wrong!");
          this.displayToast.set(true);
        },
      });
    } else {
      // show all problematic fields
      this.loginForm.markAllAsTouched();
      // display toast
      this.errMsg.set("Form Fields are not valid.");
      this.displayToast.set(true);
    }
  }
}
