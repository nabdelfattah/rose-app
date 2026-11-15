import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { Component, input, output, signal } from "@angular/core";
import { AddressModal } from "./address-modal";
import { AddressActions } from "../store/address.actions";
import { selectAddresses } from "../store/address.selector";
import { Address } from "../model/address.model";
import { provideTranslateService } from "@ngx-translate/core";
import { ConfirmModal } from "../confirm-modal/confirm-modal";
import { By } from "@angular/platform-browser";

describe("AddressModal", () => {
  let component: AddressModal;
  let fixture: ComponentFixture<AddressModal>;

  // Confirm Modal Mock
  @Component({
    selector: "app-confirm-modal",
    standalone: true,
    template: "",
  })
  class MockConfirmModal {
    visible = input.required<boolean>();
    changeVisibility = output<boolean>();
    confirm = output();
    cancel = output();
  }

  let storeMock: {
    dispatch: ReturnType<typeof vi.fn>;
    selectSignal: ReturnType<typeof vi.fn>;
  };

  const mockAddresses = [
    { id: "1", city: "Cairo" },
    { id: "2", city: "Alexandria" },
  ] as Address[];

  const addressesSignal = signal(mockAddresses);
  const selectedAddressIdSignal = signal("1");

  beforeEach(async () => {
    addressesSignal.set(mockAddresses);
    selectedAddressIdSignal.set("1");

    storeMock = {
      dispatch: vi.fn(),
      selectSignal: vi.fn((selector) =>
        selector === selectAddresses
          ? addressesSignal
          : selectedAddressIdSignal,
      ),
    };

    await TestBed.configureTestingModule({
      imports: [AddressModal],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        provideTranslateService({
          fallbackLang: "en",
        }),
      ],
    })
      .overrideComponent(AddressModal, {
        remove: {
          imports: [ConfirmModal],
        },
        add: {
          imports: [MockConfirmModal],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddressModal);
    fixture.componentRef.setInput('visible', true);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit
  it("should dispatch loadAddresses on init", () => {
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.loadAddresses(),
    );
  });

  // openDeleteConfirmation
  it("should set addressToDeleteId and open confirmation modal", () => {
    component.openDeleteConfirmation("1");

    expect(component.addressToDeleteId()).toBe("1");
    expect(component.confirmModalVisible()).toBe(true);
  });

  // onConfirmDelete
  it("should dispatch deleteAddress and close confirmation modal", () => {
    component.openDeleteConfirmation("1");

    component.onConfirmDelete();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.deleteAddress({ id: "1" }),
    );

    expect(component.confirmModalVisible()).toBe(false);
  });

  it("should not dispatch deleteAddress if there is no selected id", () => {
    component.addressToDeleteId.set(null);

    storeMock.dispatch.mockClear();

    component.onConfirmDelete();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });

  // selectAddress
  it("should dispatch selectAddress and emit false", () => {
    const visibilitySpy = vi.fn();

    component.changeVisibility.subscribe(visibilitySpy);

    component.selectAddress("2");

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.selectAddress({ id: "2" }),
    );

    expect(visibilitySpy).toHaveBeenCalledWith(false);
  });

  // Outputs
  it("should emit addAddress", () => {
    const addAddressSpy = vi.fn();

    component.addAddress.subscribe(addAddressSpy);

    component.addAddress.emit();

    expect(addAddressSpy).toHaveBeenCalled();
  });

  it("should emit editAddress with address data", () => {
    const editAddressSpy = vi.fn();

    component.editAddress.subscribe(editAddressSpy);

    const address = mockAddresses[0];

    component.editAddress.emit(address);

    expect(editAddressSpy).toHaveBeenCalledWith(address);
  });

  //Template
  it("should render all addresses", () => {
    const cards = fixture.nativeElement.querySelectorAll(".address-card");
    expect(cards.length).toBe(2);
  });

  it("should emit addAddress when add button is clicked", () => {
    const spy = vi.fn();
    component.addAddress.subscribe(spy);
    const button = fixture.nativeElement.querySelector("button[appButton]");

    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it("should emit editAddress without selecting the address", () => {
    const spy = vi.fn();
    component.editAddress.subscribe(spy);

    const editButton = fixture.nativeElement.querySelector(".edit-icon");

    editButton.click();

    expect(spy).toHaveBeenCalledWith(mockAddresses[0]);

    expect(storeMock.dispatch).not.toHaveBeenCalledWith(
      AddressActions.selectAddress({ id: "1" }),
    );
  });

  it("should open confirmation modal with the correct address id", () => {
    const deleteButton = fixture.nativeElement.querySelector(".delete-icon");

    deleteButton.click();

    fixture.detectChanges();

    expect(component.addressToDeleteId()).toBe("1");
    expect(component.confirmModalVisible()).toBe(true);

    const confirmModal = fixture.debugElement.query(
      By.directive(MockConfirmModal),
    );

    expect(confirmModal.componentInstance.visible()).toBe(true);
  });

  it("should close confirmation modal when cancel is emitted", () => {
    component.openDeleteConfirmation("1");
    fixture.detectChanges();

    const confirmModal = fixture.debugElement.query(
      By.directive(MockConfirmModal),
    );

    confirmModal.componentInstance.cancel.emit();

    fixture.detectChanges();

    expect(component.confirmModalVisible()).toBe(false);
    expect(storeMock.dispatch).not.toHaveBeenCalledWith(
      AddressActions.deleteAddress({ id: "1" }),
    );
  });

  it("should delete the correct address when confirm is emitted", () => {
    component.openDeleteConfirmation("2");
    fixture.detectChanges();

    const confirmModal = fixture.debugElement.query(
      By.directive(MockConfirmModal),
    );

    confirmModal.componentInstance.confirm.emit();

    fixture.detectChanges();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.deleteAddress({ id: "2" }),
    );

    expect(component.confirmModalVisible()).toBe(false);
  });

  it("should select address when address card is clicked", () => {
    const card = fixture.nativeElement.querySelector(".address-card");

    card.click();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.selectAddress({ id: "1" }),
    );
  });
});
