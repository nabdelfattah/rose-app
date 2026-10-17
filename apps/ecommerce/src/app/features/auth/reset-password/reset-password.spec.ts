import { ComponentFixture, TestBed } from "@angular/core/testing";
import { convertToParamMap, ActivatedRoute, Router } from "@angular/router";
import { signal } from "@angular/core";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";

import { ResetPassword } from "./reset-password";
import { userActions } from "../store/user.actions";
import { selectLoading } from "../store/user.selector";
import { LanguageService } from "../../../../../../../../rose-app/libs/shared/language/language.service";

describe("ResetPassword", () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let store: MockStore;
  let actions$: Subject<unknown>;
  let router: Router;

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: convertToParamMap({
        token: "test-token",
      }),
    },
  };

  beforeEach(async () => {
    actions$ = new Subject<unknown>();

    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectLoading, value: false }],
        }),
        provideMockActions(() => actions$),
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: LanguageService,
          useValue: {
            currentLang: signal("en"),
            toggleLanguage: vi.fn(),
            setLanguage: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    vi.spyOn(store, "dispatch");

    fixture.detectChanges();
  });

  afterEach(() => {
    actions$.complete();
    store.resetSelectors();
    vi.restoreAllMocks();
  });

  // Component

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should read token from query params", () => {
    expect(
      TestBed.inject(ActivatedRoute).snapshot.queryParamMap.get("token"),
    ).toBe("test-token");

    expect(component.token).toBe("test-token");
  });

  // Form Validation

  describe("Form Validation", () => {
    it("should be invalid when fields are empty", () => {
      expect(component.resetPasswordForm.invalid).toBe(true);
    });

    it("should be invalid when password has fewer than 8 characters", () => {
      component.resetPasswordForm.patchValue({
        password: "Test123",
        rePassword: "Test123",
      });

      expect(
        component.resetPasswordForm.controls.password.invalid,
      ).toBe(true);

      expect(component.resetPasswordForm.invalid).toBe(true);
    });

    it("should be invalid when passwords do not match", () => {
      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Different@123",
      });

      expect(component.resetPasswordForm.hasError("mismatch")).toBe(true);
      expect(component.resetPasswordForm.invalid).toBe(true);
    });

    it("should be valid when passwords match and meet requirements", () => {
      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Test@12345",
      });

      expect(component.resetPasswordForm.valid).toBe(true);
    });
  });

  // Submit

  describe("Submit", () => {
    it("should mark all controls as touched when submitting", () => {
      component.submit();

      expect(
        component.resetPasswordForm.controls.password.touched,
      ).toBe(true);

      expect(
        component.resetPasswordForm.controls.rePassword.touched,
      ).toBe(true);
    });

    it("should not dispatch when the form is invalid", () => {
      component.submit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch resetPassword with the correct payload", () => {
      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Test@12345",
      });

      component.submit();

      expect(store.dispatch).toHaveBeenCalledWith(
        userActions.resetPassword({
          payload: {
            token: "test-token",
            newPassword: "Test@12345",
            confirmPassword: "Test@12345",
          },
        }),
      );
    });

    it("should not dispatch when loading", () => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();

      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Test@12345",
      });

      component.submit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should not dispatch when token is empty", () => {
      Object.defineProperty(component, "token", {
        value: "",
        configurable: true,
      });

      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Test@12345",
      });

      component.submit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should navigate to login after reset succeeds", () => {
      actions$.next(userActions.resetPasswordSuccessfully());

      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("should not navigate to login before reset succeeds", () => {
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  // Template

  describe("Template rendering", () => {
    it("should render two password inputs", () => {
      const inputs = fixture.nativeElement.querySelectorAll("app-input");

      expect(inputs.length).toBe(2);
    });

    it("should render the reset password form", () => {
      const form = fixture.nativeElement.querySelector("form");

      expect(form).toBeTruthy();
    });

    it("should display mismatch error when passwords do not match", () => {
      component.resetPasswordForm.patchValue({
        password: "Test@12345",
        rePassword: "Different@123",
      });

      component.resetPasswordForm.controls.rePassword.markAsTouched();

      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector(".error");

      expect(component.resetPasswordForm.hasError("mismatch")).toBe(true);
      expect(error).toBeTruthy();
    });
  });

  // Template interactions

  describe("Template interactions", () => {
    it("should call submit when the form is submitted", () => {
      const submitSpy = vi.spyOn(component, "submit");

      const form: HTMLFormElement =
        fixture.nativeElement.querySelector("form");

      form.dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(submitSpy).toHaveBeenCalledTimes(1);
    });
  });
});