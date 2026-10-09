import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FormControl, Validators } from '@angular/forms';
import { GenderInput } from './gender-input';


describe('GenderInput', () => {
  let component: GenderInput;
  let fixture: ComponentFixture<GenderInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenderInput],
    }).compileComponents();

    fixture = TestBed.createComponent(GenderInput);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('id', 'gender');
    fixture.componentRef.setInput('control', new FormControl(''));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Gender label', () => {
    expect(component.label()).toBe('Gender');
  });

  it('should have Select Gender as placeholder', () => {
    expect(component.placeholder()).toBe('Select Gender');
  });

  it('should accept the provided FormControl', () => {
    const control = new FormControl('Male');
    fixture.componentRef.setInput('control', control);
    expect(component.control()).toBe(control);
  });

  //Template
  it('should display the label', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Gender');
    expect(label.htmlFor).toBe('gender');
  });

  it('should display the placeholder', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.options[0].textContent?.trim()).toBe('Select Gender');
  });

  it('should display Male and Female options', () => {
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('select option'),);
    expect(options.map((option) => option.value)).toEqual([
      '',
      'male',
      'female',
    ]);
  });

  it('should update the FormControl when selecting a gender', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'male';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.control().value).toBe('male');
  });

  it('should display the error message when required and touched', () => {
    const control = component.control();
    control.setValidators(Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();

    fixture.detectChanges();

    const error: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(error).not.toBeNull();
    expect(error?.textContent).toContain(
      'Please select your gender.',
    );
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

