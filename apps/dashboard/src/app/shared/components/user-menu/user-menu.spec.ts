import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { UserMenu } from "./user-menu";
import { Session } from "../../../core/services/session";
import { Component } from "@angular/core";

@Component({
  template: "",
})
class DummyComponent {}

describe("UserMenu", () => {
  let component: UserMenu;
  let fixture: ComponentFixture<UserMenu>;
  let sessionMock: { clear: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    sessionMock = {
      clear: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserMenu],
      providers: [
        provideRouter([{ path: "login", component: DummyComponent }]),
        { provide: Session, useValue: sessionMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenu);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  // Component creation
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Inputs
  it("should have default variant as sidebar", () => {
    expect(component.variant()).toBe("sidebar");
  });

  it("should accept user inputs", () => {
    fixture.componentRef.setInput("firstName", "Mahmoud");
    fixture.componentRef.setInput("lastName", "Mohamed");
    fixture.componentRef.setInput("email", "test@example.com");

    expect(component.firstName()).toBe("Mahmoud");
    expect(component.lastName()).toBe("Mohamed");
    expect(component.email()).toBe("test@example.com");
  });

  // User initials
  it("should return user initials in uppercase", () => {
    fixture.componentRef.setInput("firstName", "mahmoud");
    fixture.componentRef.setInput("lastName", "mohamed");

    expect(component.userCharacters()).toBe("MM");
  });

  it("should handle missing names", () => {
    expect(component.userCharacters()).toBe("");
  });

  it("should handle only first name", () => {
    fixture.componentRef.setInput("firstName", "Mahmoud");

    expect(component.userCharacters()).toBe("M");
  });

  // Menu
  it("should open menu when toggleMenu is called", () => {
    component.toggleMenu();

    expect(component.menuOpen()).toBe(true);
  });

  it("should close menu when closeMenu is called", () => {
    component.menuOpen.set(true);

    component.closeMenu();

    expect(component.menuOpen()).toBe(false);
  });

  it("should toggle menu state", () => {
    component.toggleMenu();
    component.toggleMenu();

    expect(component.menuOpen()).toBe(false);
  });

  // Document click
  it("should close menu when clicking outside component", () => {
    component.menuOpen.set(true);

    const outsideElement = document.createElement("div");

    component.onDocumentClick({
      target: outsideElement,
    } as unknown as MouseEvent);

    expect(component.menuOpen()).toBe(false);
  });

  it("should not close menu when clicking inside component", () => {
    component.menuOpen.set(true);

    component.onDocumentClick({
      target: fixture.nativeElement,
    } as unknown as MouseEvent);

    expect(component.menuOpen()).toBe(true);
  });

  // Panel classes
  it("should return sidebar panel classes", () => {
    expect(component.panelClasses()).toContain("bottom-full");
    expect(component.panelClasses()).toContain("opacity-0");
  });

  it("should return open sidebar panel classes", () => {
    component.menuOpen.set(true);

    expect(component.panelClasses()).toContain("opacity-100");
    expect(component.panelClasses()).toContain("scale-100");
  });

  it("should return navbar panel classes", () => {
    fixture.componentRef.setInput("variant", "navbar");

    expect(component.panelClasses()).toContain("end-0");
    expect(component.panelClasses()).toContain("top-full");
  });

  it("should return open navbar panel classes", () => {
    fixture.componentRef.setInput("variant", "navbar");
    component.menuOpen.set(true);

    expect(component.panelClasses()).toContain("opacity-100");
    expect(component.panelClasses()).toContain("scale-100");
  });

  // Logout
  it("should clear session on logout", () => {
    component.logout();

    expect(sessionMock.clear).toHaveBeenCalled();
  });

  it("should navigate to login after logout", () => {
    const navigateSpy = vi.spyOn(router, "navigateByUrl");

    component.logout();

    expect(navigateSpy).toHaveBeenCalledWith("/login");
  });
});
