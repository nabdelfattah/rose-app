
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FormControl, Validators } from '@angular/forms';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { GenderInput } from './gender-input';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of({
      auth: {
        register: {
          about: {
            gender: 'Gender',
            'select-gender': 'Select Gender',
            male: 'Male',
            female: 'Female',
          },
        },
      },
      validation: {
        required: '{{field}} is required',
      },
    });
  }
}

describe('GenderInput', () => {
  let component: GenderInput;
  let fixture: ComponentFixture<GenderInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenderInput],
      providers: [
        provideTranslateService({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenderInput);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('id', 'gender');
    fixture.componentRef.setInput(
      'label',
      'auth.register.about.gender',
    );
    fixture.componentRef.setInput(
      'placeholder',
      'auth.register.about.select-gender',
    );
    fixture.componentRef.setInput('control', new FormControl(''));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the gender translation key as label', () => {
    expect(component.label()).toBe('auth.register.about.gender');
  });

  it('should have the select gender translation as placeholder', () => {
    expect(component.placeholder()).toBe(
      'auth.register.about.select-gender',
    );
  });

  it('should accept the provided FormControl', () => {
    const control = new FormControl('Male');
    fixture.componentRef.setInput('control', control);
    expect(component.control()).toBe(control);
  });

  // Template

  it('should display the translated label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Gender');
    expect(label.htmlFor).toBe('gender');
  });

  it('should display the translated placeholder', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.options[0].textContent?.trim()).toBe(
      'Select Gender',
    );
  });

  it('should display Male and Female options', () => {
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('select option'),
    );

    expect(options.map((option) => option.value)).toEqual([
      '',
      'male',
      'female',
    ]);
    expect(options[1].textContent?.trim()).toBe('Male');
    expect(options[2].textContent?.trim()).toBe('Female');
  });

  it('should update the FormControl when selecting a gender', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'male';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.control().value).toBe('male');
  });

  it('should display the translated required error when touched', () => {
    const control = component.control();
    control.setValidators(Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();

    fixture.detectChanges();

    const error: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(error).not.toBeNull();
    expect(error?.textContent).toContain('Gender is required');
  });

  it('should not display the error message when the control is untouched', () => {
    const error: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(error).toBeNull();
  });

  it('should hide the error message when a valid gender is selected', () => {
    const control = component.control();
    control.setValidators(Validators.required);
    control.setValue('male');
    control.markAsTouched();
    fixture.detectChanges();
    const error: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(error).toBeNull();
  });
});

