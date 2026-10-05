import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, RouterOutlet } from "@angular/router";
import { By } from "@angular/platform-browser";
import { App } from "./app";

describe("App", () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render the router outlet", () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
