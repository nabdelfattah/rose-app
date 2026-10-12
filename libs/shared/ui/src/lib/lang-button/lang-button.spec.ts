import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LangButton } from './lang-button';
import { LanguageService } from '../../../../language/language.service';

describe('LangButton', () => {
  let fixture: ComponentFixture<LangButton>;
  let component: LangButton;

  const languageServiceMock = {
    currentLang: vi.fn(),
    toggleLanguage: vi.fn(),
  };

  beforeEach(async () => {
    languageServiceMock.currentLang.mockReset();
    languageServiceMock.toggleLanguage.mockReset();
    languageServiceMock.currentLang.mockReturnValue('en');

    await TestBed.configureTestingModule({
      imports: [LangButton],
      providers: [
        {
          provide: LanguageService,
          useValue: languageServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LangButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display العربية when current language is English', () => {
    expect(fixture.nativeElement.querySelector('button').textContent.trim()).toBe('العربية');
  });

  it('should display EN when current language is Arabic', () => {
    languageServiceMock.currentLang.mockReturnValue('ar');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').textContent.trim()).toBe('EN');
  });

  it('should call toggleLanguage when button is clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    expect(languageServiceMock.toggleLanguage).toHaveBeenCalledTimes(1);
  });
});
