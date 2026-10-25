import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { SectionFeatures } from "./section-features";
import { el } from "intl-tel-input/locale";

describe("SectionFeatures", () => {
  let component: SectionFeatures;
  let fixture: ComponentFixture<SectionFeatures>;
  let el: HTMLElement;

  const getItems = () => el.querySelectorAll('[data-testid="feature-item"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFeatures],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFeatures);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show 4 feature cards", () => {
    expect(getItems().length).toBe(4);
  });

  it("should show an icon in every card", () => {
    getItems().forEach((item) => {
      expect(item.querySelector("svg")).toBeTruthy();
    });
  });
});
