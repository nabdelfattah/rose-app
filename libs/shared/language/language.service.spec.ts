
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: { use: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
    document.documentElement.dir = '';
    translateService = {
      use: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        {
          provide: TranslateService,
          useValue: translateService,
        },
      ],
    });
  });

  function createService(): LanguageService {
    service = TestBed.inject(LanguageService);
    return service;
  }

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  it('should initialize with English by default', () => {
    createService();
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem('language')).toBe('en');
    expect(translateService.use).toHaveBeenLastCalledWith('en');
  });

  it('should switch from English to Arabic', () => {
    createService();
    service.toggleLanguage();
    expect(service.currentLang()).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem('language')).toBe('ar');
    expect(translateService.use).toHaveBeenLastCalledWith('ar');
  });

  it('should switch from Arabic to English', () => {
    localStorage.setItem('language', 'ar');
    createService();
    service.toggleLanguage();
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem('language')).toBe('en');
    expect(translateService.use).toHaveBeenLastCalledWith('en');
  });

  it('should restore Arabic from localStorage', () => {
    localStorage.setItem('language', 'ar');
    createService();
    expect(service.currentLang()).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(translateService.use).toHaveBeenLastCalledWith('ar');
  });

  it('should fall back to English for an invalid saved language', () => {
    localStorage.setItem('language', 'fr');
    createService();
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should set the selected language', () => {
    createService();
    service.setLanguage('ar');
    expect(service.currentLang()).toBe('ar');
    expect(translateService.use).toHaveBeenLastCalledWith('ar');
  });
});
