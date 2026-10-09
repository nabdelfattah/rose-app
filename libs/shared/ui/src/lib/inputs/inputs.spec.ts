import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormControl } from '@angular/forms';
import { Input } from './inputs';
import { PLATFORM_ID } from '@angular/core';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('id', 'email');
    fixture.componentRef.setInput('control', new FormControl(''));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept the provided label', () => {
    expect(component.label()).toBe('Email');
  });

  it('should have text as the default type', () => {
    expect(component.type()).toBe('text');
  });

  it('should have an empty placeholder by default', () => {
    expect(component.placeholder()).toBe('');
  });

  it('should have an empty helperText by default', () => {
    expect(component.helperText()).toBe('');
  });

  it('should have false as the default showPassword state', () => {
    expect(component.showPassword()).toBe(false);
  });

  it('should accept the provided FormControl', () => {
    const control = new FormControl('test@example.com');
    fixture.componentRef.setInput('control', control);
    expect(component.control()).toBe(control);
  });

  // Template
  it('should display the label', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Email');
    expect(label.htmlFor).toBe('email');
  });

  it('should display the input with the provided id', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.id).toBe('email');
  });

  it('should display the provided placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter your email');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Enter your email');
  });

  it('should display the helper text when provided', () => {
    fixture.componentRef.setInput('helperText','Enter your email address',
    );
    fixture.detectChanges();
    const helper: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(helper.textContent).toContain('Enter your email address');
  });

  it('should bind the input value to the FormControl', () => {
    const control = new FormControl('test@example.com');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('test@example.com');
  });

  it('should display the password toggle button for password type', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();
    expect(button.type).toBe('button');
  });

  it('should not display the password toggle button for text type', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.detectChanges();
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    expect(button).toBeNull();
  });

  it('should change the input type to text when clicking the password toggle', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(component.showPassword()).toBe(true);
  });

  it('should change the input type back to password when clicking again', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    button.click();
    fixture.detectChanges();
    expect(input.type).toBe('password');
    expect(component.showPassword()).toBe(false);
  });

  it('should display required error when the control is touched and empty', () => {
    const control = component.control();
    control.setErrors({ required: true });
    control.markAsTouched();
    fixture.detectChanges();
    const error: HTMLElement | null = fixture.nativeElement.querySelector('.error');
    expect(error).not.toBeNull();
    expect(error?.textContent).toContain('Your Email is required');
  });

  it('should display email error when the email is invalid and touched', () => {
    const control = component.control();
    control.setErrors({ email: true });
    control.markAsTouched();
    fixture.detectChanges();
    const errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.error');
    expect(
      Array.from(errors).some((error) =>
        error.textContent?.includes('Please Enter Valid Email'),
      ),
    ).toBe(true);
  });

  it('should not display validation errors when the control is untouched', () => {
    const control = component.control();
    control.setErrors({ required: true });
    control.markAsUntouched();
    fixture.detectChanges();
    const error: HTMLElement | null = fixture.nativeElement.querySelector('.error');
    expect(error).toBeNull();
  });

  it('should display password pattern errors when the password is invalid and touched', () => {
    fixture.componentRef.setInput('label', 'Password');
    fixture.componentRef.setInput('type', 'password');
    const control = component.control();
    control.setErrors({ pattern: true });
    control.markAsTouched();
    fixture.detectChanges();
    const errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.error');
    expect(
      Array.from(errors).some((error) =>
        error.textContent?.includes(
          'Password must be at least 8 characters',
        ),
      ),
    ).toBe(true);

    expect(
      Array.from(errors).some((error) =>
        error.textContent?.includes(
          'Password must include at least one uppercase letter',
        ),
      ),
    ).toBe(true);

    expect(
      Array.from(errors).some((error) =>
        error.textContent?.includes(
          'Password must include at least one special character',
        ),
      ),
    ).toBe(true);
  });

  it('should display the phone pattern error for tel type', () => {
    fixture.componentRef.setInput('type', 'tel');
    const control = component.control();
    control.setErrors({ pattern: true });
    control.markAsTouched();
    fixture.detectChanges();
    const errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.error');
    expect(
      Array.from(errors).some((error) =>
        error.textContent?.includes('Accept Egyption Numbers Only'),
      ),
    ).toBe(true);
  });
});
