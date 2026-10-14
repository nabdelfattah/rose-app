import { signal } from "@angular/core";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { provideRouter, Router } from "@angular/router";
import { Subject } from "rxjs";
import { Register } from "./register";
import { userActions } from "../store/user.actions";
import { selectLoading } from "../store/user.selector";
import { LanguageService } from "../../../../../../../../rose-app/libs/shared/language/language.service";

describe("Register", () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let store: MockStore;
  let actions$: Subject<unknown>;
  let router: Router;

  beforeEach(async () => {
    actions$ = new Subject<unknown>();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectLoading, value: false }],
        }),
        provideMockActions(() => actions$),
        provideRouter([]),
        provideTranslateService(),
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
    vi.spyOn(router, "navigate");

    fixture = TestBed.createComponent(Register);
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start at step 1", () => {
    expect(component.currentStep()).toBe(1);
  });

  // Email

  describe("Step 1 - Email", () => {
    it("should not dispatch when email is empty", () => {
      component.registerForm.controls.email.setValue("");

      component.nextStep();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should not dispatch when email is invalid", () => {
      component.registerForm.controls.email.setValue("invalid-email");

      component.nextStep();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch verifyEmail when email is valid", () => {
      const email = "test@example.com";

      component.registerForm.controls.email.setValue(email);
      component.nextStep();

      expect(store.dispatch).toHaveBeenCalledWith(
        userActions.verifyEmail({
          payload: { email },
        }),
      );

      expect(component.email()).toBe(email);
    });

    it("should not dispatch when loading", () => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();

      component.registerForm.controls.email.setValue("test@example.com");
      component.nextStep();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should move to step 2 after email verification succeeds", () => {
      actions$.next(userActions.verifyEmailSuccessfully());

      expect(component.currentStep()).toBe(2);
    });
  });

  // OTP

  describe("Step 2 - OTP", () => {
    beforeEach(() => {
      component.currentStep.set(2);
      component.registerForm.controls.email.setValue("test@example.com");
    });

    it("should update OTP value", () => {
      component.onOtpChange({ value: "123456" });

      expect(component.otpValue).toBe("123456");
    });

    it("should not dispatch when OTP has fewer than 6 digits", () => {
      component.onOtpChange({ value: "12345" });
      component.nextStep();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch confirmEmail when OTP has 6 digits", () => {
      const code = "123456";

      component.onOtpChange({ value: code });
      component.nextStep();

      expect(store.dispatch).toHaveBeenCalledWith(
        userActions.confirmEmail({
          payload: {
            email: "test@example.com",
            code,
          },
        }),
      );
    });

    it("should not dispatch when loading", () => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();

      component.onOtpChange({ value: "123456" });
      component.nextStep();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should move to step 3 after email confirmation succeeds", () => {
      actions$.next(userActions.confirmEmailSuccessfully());

      expect(component.currentStep()).toBe(3);
    });
  });

  // About

  describe("Step 3 - About", () => {
    beforeEach(() => {
      component.currentStep.set(3);
    });

    it("should not move to step 4 when details are invalid", () => {
      component.registerForm.controls.firstName.setValue("");

      component.nextStep();

      expect(component.currentStep()).toBe(3);
    });

    it("should move to step 4 when details are valid", () => {
      component.registerForm.patchValue({
        firstName: "Ahmed",
        lastName: "Ali",
        username: "ahmed123",
        phone: "01012345678",
        gender: "MALE",
      });

      component.nextStep();

      expect(component.currentStep()).toBe(4);
    });
  });

  // Submit

  describe("Submit", () => {
    it("should not dispatch when the form is invalid", () => {
      component.submit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should mark all controls as touched when the form is invalid", () => {
      component.submit();

      expect(component.registerForm.controls.email.touched).toBe(true);
    });

    it("should dispatch register with the correct payload", () => {
      component.registerForm.patchValue({
        email: "test@example.com",
        firstName: "Ahmed",
        lastName: "Ali",
        username: "ahmed123",
        phone: "01012345678",
        gender: "MALE",
        password: "Test@12345",
        rePassword: "Test@12345",
      });

      if (component.registerForm.invalid) {
        throw new Error(
          "Test data is invalid. Check passwordPattern and confirmPassword.",
        );
      }

      component.submit();

      expect(store.dispatch).toHaveBeenCalledWith(
        userActions.register({
          payload: {
            username: "ahmed123",
            email: "test@example.com",
            password: "Test@12345",
            confirmPassword: "Test@12345",
            firstName: "Ahmed",
            lastName: "Ali",
            phone: "01012345678",
            gender: "male",
          },
        }),
      );

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("should not dispatch when loading", () => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();

      component.submit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should navigate to login after registration succeeds", () => {
      const user = {
        id: "1",
        username: "ahmed123",
        email: "test@example.com",
        phone: "01012345678",
        firstName: "Ahmed",
        lastName: "Ali",
        gender: "male",
        role: "user",
        emailVerified: true,
        phoneVerified: false,
        token: "test-token",
      };

      actions$.next(userActions.registerSuccessfully({ user }));

      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("should not navigate to login before registration succeeds", () => {
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  // Template
  describe("Template rendering", () => {
    it("should render the email form in step 1", () => {
      component.currentStep.set(1);
      fixture.detectChanges();

      const form: HTMLFormElement | null =
        fixture.nativeElement.querySelector("form");
      const inputs = fixture.nativeElement.querySelectorAll("app-input");
      const stepper = fixture.nativeElement.querySelector("app-stepper");

      expect(form).toBeTruthy();
      expect(inputs.length).toBe(1);
      expect(stepper).toBeNull();
    });

    it("should render the OTP section in step 2", () => {
      component.currentStep.set(2);
      fixture.detectChanges();

      const otp = fixture.nativeElement.querySelector("p-inputotp");
      const stepper = fixture.nativeElement.querySelector("app-stepper");

      expect(otp).toBeTruthy();
      expect(stepper).toBeTruthy();
    });

    it("should render about fields in step 3", () => {
      component.currentStep.set(3);
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll("app-input");
      const genderInput =
        fixture.nativeElement.querySelector("app-gender-input");

      expect(inputs.length).toBe(4);
      expect(genderInput).toBeTruthy();
    });

    it("should render password fields in step 4", () => {
      component.currentStep.set(4);
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll("app-input");
      const stepper = fixture.nativeElement.querySelector("app-stepper");

      expect(inputs.length).toBe(2);
      expect(stepper).toBeTruthy();
    });
  });

  describe("Template interactions", () => {
    it("should call nextStep when the email form is submitted", () => {
      component.currentStep.set(1);
      fixture.detectChanges();

      const nextStepSpy = vi.spyOn(component, "nextStep");
      const form: HTMLFormElement =
        fixture.nativeElement.querySelector("form");

      form.dispatchEvent(new Event("submit"));

      expect(nextStepSpy).toHaveBeenCalledTimes(1);
    });

    it("should call submit when the password form is submitted", () => {
      component.currentStep.set(4);
      fixture.detectChanges();

      const submitSpy = vi.spyOn(component, "submit");
      const form: HTMLFormElement =
        fixture.nativeElement.querySelector("form");

      form.dispatchEvent(new Event("submit"));

      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("should display the mismatch error when passwords do not match", () => {
      component.currentStep.set(4);
      component.registerForm.controls.password.setValue("Test@12345");
      component.registerForm.controls.rePassword.setValue("Different@123");

      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector(".error");

      expect(component.registerForm.hasError("mismatch")).toBe(true);
      expect(error).toBeTruthy();
    });
  });
});
