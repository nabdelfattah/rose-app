import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthHeading } from './auth-heading';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  imports: [AuthHeading],
  template: `<app-auth-heading>Login</app-auth-heading>`,
})
class HostComponent {}

describe('AuthHeading', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.debugElement.children[0].componentInstance).toBeInstanceOf(AuthHeading);
  });

  it('should render the projected text inside an h1', () => {
    const h1: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

    expect(h1.textContent?.trim()).toBe('Login');
  });
});
