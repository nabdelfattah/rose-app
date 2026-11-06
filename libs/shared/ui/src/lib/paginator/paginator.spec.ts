import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Paginator } from './paginator';

describe('Paginator', () => {
  let fixture: ComponentFixture<Paginator>;
  let component: Paginator;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginator],
    }).compileComponents();

    fixture = TestBed.createComponent(Paginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('items', () => {
    it('should display all pages when total pages <= 5', () => {
      fixture.componentRef.setInput('totalPages', 4);
      fixture.detectChanges();
      expect(component.items()).toEqual([1, 2, 3, 4]);
    });

    it('should display first pages when current page <= 3', () => {
      fixture.componentRef.setInput('page', 2);
      fixture.componentRef.setInput('totalPages', 10);
      expect(component.items()).toEqual([1, 2, 3, '...', 10]);
    });

    it('should display last pages when current page is near the end', () => {
      fixture.componentRef.setInput('page', 9);
      fixture.componentRef.setInput('totalPages', 10);
      expect(component.items()).toEqual([1, '...', 8, 9, 10]);
    });

    it('should display surrounding pages when current page is in the middle', () => {
      fixture.componentRef.setInput('page', 5);
      fixture.componentRef.setInput('totalPages', 10);
      expect(component.items()).toEqual([
        1, '...', 4, 5, 6, '...', 10
      ]);
    });
  });

  describe('go()', () => {
    it('should emit pageChange when navigating to a valid page', () => {
      fixture.componentRef.setInput('totalPages', 5);
      const emitSpy = vi.spyOn(component.pageChange, 'emit');
      component.go(2);
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should not emit when selecting the current page', () => {
      const emitSpy = vi.spyOn(component.pageChange, 'emit');
      component.go(1);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when page is less than 1', () => {
      const emitSpy = vi.spyOn(component.pageChange, 'emit');
      component.go(0);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when page exceeds total pages', () => {
      fixture.componentRef.setInput('totalPages', 5);
      const emitSpy = vi.spyOn(component.pageChange, 'emit');
      component.go(6);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
