import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { TranslateLoader, provideTranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LanguageService } from "@rose-app/ui";
import { Login } from "./login";
import { userActions } from "../store/user.actions";
import { selectLoading } from "../store/user.selector";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of({
      validation: {
        required: "Your {{field}} is required",
      },
    });
  }
}

describe("Login", () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let store: MockStore;

  const languageServiceMock = {
    currentLang: vi.fn().mockReturnValue("en"),
    toggleLanguage: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectLoading, value: false }],
        }),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("form", () => {
    it("should start empty and invalid", () => {
      expect(component.loginForm.getRawValue()).toEqual({
        username: "",
        password: "",
      });
      expect(component.loginForm.valid).toBe(false);
    });

    it("should require the username", () => {
      const username = component.loginForm.controls.username;
      expect(username.hasError("required")).toBe(true);
    });

    it("should require the username to be at least 3 characters", () => {
      const username = component.loginForm.controls.username;
      username.setValue("ab");
      expect(username.hasError("minlength")).toBe(true);

      username.setValue("abc");
      expect(username.valid).toBe(true);
    });

    it("should require the password", () => {
      const password = component.loginForm.controls.password;
      expect(password.hasError("required")).toBe(true);

      password.setValue("secret");
      expect(password.valid).toBe(true);
    });

    it("should be valid when username and password are provided", () => {
      component.loginForm.setValue({ username: "nada", password: "secret" });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe("submitHandler", () => {
    it("should dispatch the login action with the form value when valid", () => {
      component.loginForm.setValue({ username: "nada", password: "secret" });

      component.submitHandler();

      expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(
        userActions.login({
          payload: { username: "nada", password: "secret" },
        }),
      );
    });

    it("should not dispatch and mark all fields as touched when invalid", () => {
      component.submitHandler();

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(component.loginForm.controls.username.touched).toBe(true);
      expect(component.loginForm.controls.password.touched).toBe(true);
    });
  });
});
