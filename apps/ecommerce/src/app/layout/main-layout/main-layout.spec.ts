import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { MainLayout } from './main-layout';
import { Header } from '../header/header';

// Fake header (the real one needs Store, Actions, Session...)
@Component({ selector: 'app-header', template: '' })
class HeaderStub {}

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      // the real Footer is still rendered and uses the translate pipe
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en' })]
    })
      .overrideComponent(MainLayout, {
        remove: { imports: [Header] },
        add: { imports: [HeaderStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
