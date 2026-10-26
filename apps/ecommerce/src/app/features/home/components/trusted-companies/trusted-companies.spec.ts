import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustedCompanies } from './trusted-companies';

describe('TrustedCompanies', () => {
  let component: TrustedCompanies;
  let fixture: ComponentFixture<TrustedCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedCompanies],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustedCompanies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 6 logo images', () => {
    const imgs = fixture.nativeElement.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    expect(imgs.length).toBe(6);
  });

  it('should contain the heading text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Trusted By Over 4.5k+ Companies');
  });

  it('should render logos with correct src paths', () => {
    const imgs = fixture.nativeElement.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    const srcs = Array.from(imgs).map((img) => img.getAttribute('src'));
    expect(srcs).toContain('images/companies/image 36.svg');
    expect(srcs).toContain('images/companies/image 41.svg');
  });
});
