import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SectionFeatures } from "./section-features";

describe("SectionFeatures", () => {
  let component: SectionFeatures;
  let fixture: ComponentFixture<SectionFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFeatures],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFeatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
