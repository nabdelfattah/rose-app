import { ComponentFixture, TestBed } from "@angular/core/testing";
import { signal } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { provideRouter, Router } from "@angular/router";
import { Subject } from "rxjs";
import { ForgetPassword } from "./forget-password";
import { userActions } from "../store/user.actions";
import { selectLoading } from "../store/user.selector";
import { LanguageService } from "../../../../../../../../rose-app/libs/shared/language/language.service";

describe("ForgetPassword", () => {
  let component: ForgetPassword;
  let fixture: ComponentFixture<ForgetPassword>;
  let store: MockStore;
  let actions$: Subject<unknown>;
  let router: Router;

  beforeEach(async () => {
    actions$ = new Subject<unknown>();

    await TestBed.configureTestingModule({
      imports: [ForgetPassword],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectLoading, value: false },
          ],
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

    fixture = TestBed.createComponent(ForgetPassword);
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

  describe("Submit Email", () => {
    it("should not dispatch when email is empty", () => {
      component.forgotPasswordForm.controls.email.setValue("");
      component.submitEmail();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should mark email as touched when submitting", () => {
      component.submitEmail();
      expect(component.forgotPasswordForm.controls.email.touched).toBe(true);
    });

    it("should not dispatch when email is invalid", () => {
      component.forgotPasswordForm.controls.email.setValue("invalid-email");
      component.submitEmail();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch forgetPassword with the correct payload", () => {
      const email = "test@example.com";
      component.forgotPasswordForm.controls.email.setValue(email);
      const origin = TestBed.inject(DOCUMENT).location!.origin;
      const redirectUrl = new URL(
        router.serializeUrl(
          router.createUrlTree(["/reset-password"]),
        ),
        origin,
      ).toString();

      component.submitEmail();

      expect(store.dispatch).toHaveBeenCalledWith(
        userActions.forgetPassword({
          payload: {
            email,
            redirectUrl,
          },
        }),
      );

      expect(component.email()).toBe(email);
    });

    it("should not dispatch when loading", () => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();
      component.forgotPasswordForm.controls.email.setValue("test@example.com");

      component.submitEmail();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should move to step 2 after forget password succeeds", () => {
      actions$.next(userActions.forgetPasswordSuccessfully());
      expect(component.currentStep()).toBe(2);
    });

  });

  // Template
  describe("Template rendering", () => {
    it("should render the component template", () => {
      expect(fixture.nativeElement).toBeTruthy();
      expect(fixture.nativeElement.innerHTML).not.toBe("");
    });
  });

  describe("Template interactions", () => {
    it("should call submitEmail when the form is submitted", () => {
      const submitEmailSpy = vi.spyOn(component, "submitEmail");
      const form: HTMLFormElement | null = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
      form!.dispatchEvent(new Event("submit"));
      expect(submitEmailSpy).toHaveBeenCalledTimes(1);
    });
  });
});