import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeButtonComponent } from './theme-button';
import { ThemeService } from '../../../../theme/theme.service';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('ThemeButtonComponent', () => {
  let component: ThemeButtonComponent;
  let fixture: ComponentFixture<ThemeButtonComponent>;
  let themeService: { 
        toggle: ReturnType<typeof vi.fn> 
    };

  beforeEach(async () => {
    themeService = {
      toggle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeButtonComponent],
      providers: [
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call themeService.toggle when toggle is called', () => {
    component.toggle();

    expect(themeService.toggle).toHaveBeenCalledOnce();
  });
});
