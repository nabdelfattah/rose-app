import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Store } from "@ngrx/store";
import { userActions } from "../store/user.actions";
import { RegisterPayload } from "../models/payloads";

@Component({
  selector: "app-register",
  imports: [],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class Register implements OnInit {
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);

  payload: RegisterPayload = {
    username: "nada_test",
    email: "nada.test@example.com",
    password: "Rose@1234",
    confirmPassword: "Rose@1234",
    firstName: "Nada",
    lastName: "Test",
    phone: "+201012345678",
    gender: "FEMALE",
  };
  ngOnInit() {
    // ngOnInit also runs during SSR; only dispatch in the browser so we don't register twice
    if (!isPlatformBrowser(this.platformId)) return;
    this.store.dispatch(userActions.register({ payload: this.payload }));
  }
}
