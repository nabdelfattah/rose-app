import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { ConfirmModal } from './confirm-modal';
describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
      providers: [
        provideTranslateService({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive visible input', () => {
    expect(component.visible()).toBe(true);
  });

  it('should emit confirm when confirm button is clicked', () => {
    const confirmSpy = vi.fn();
    component.confirm.subscribe(confirmSpy);

    const button = fixture.debugElement.query(By.css('.confirm'));
    button.nativeElement.click();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel when cancel button is clicked', () => {
    const cancelSpy = vi.fn();
    component.cancel.subscribe(cancelSpy);

    const button = fixture.debugElement.query(By.css('.cancel'));
    button.nativeElement.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit false when dialog visibility changes', () => {
    const visibilitySpy = vi.fn();
    component.changeVisibility.subscribe(visibilitySpy);

    const dialog = fixture.debugElement.query(By.css('p-dialog'));
    dialog.triggerEventHandler('visibleChange', false);

    expect(visibilitySpy).toHaveBeenCalledWith(false);
  });
});