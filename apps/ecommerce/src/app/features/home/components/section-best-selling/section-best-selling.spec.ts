import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionBestSelling } from './section-best-selling';

describe('SectionBestSelling', () => {
  let component: SectionBestSelling;
  let fixture: ComponentFixture<SectionBestSelling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBestSelling]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionBestSelling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
