
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NewAddress } from "./new-address";
import { signal } from "@angular/core";
import { Subject } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { GoogleMapsService } from "../services/google-maps/google-maps.service";
import { Actions } from "@ngrx/effects";
import { provideTranslateService } from "@ngx-translate/core";
import { AddressActions } from "../store/address.actions";
import { Address } from "../model/address.model";

describe("NewAddress", () => {
  let component: NewAddress;
  let fixture: ComponentFixture<NewAddress>;
  let actionsSubject: Subject<Action>;

  const storeMock = {
    dispatch: vi.fn(),
    selectSignal: vi.fn(() => signal([])),
  };

  const googleMapsServiceMock = {
    load: vi.fn().mockResolvedValue(undefined),
  };

  const mockAddress = {
    id: "address-1",
    title: "Home",
    city: "Cairo",
    street: "Nasr City",
    phone: "01012345678",
    isPrimary: true,
    latitude: "30.0444",
    longitude: "31.2357",
  } as Address;

  beforeEach(async () => {
    vi.clearAllMocks();
    actionsSubject = new Subject<Action>();

    await TestBed.configureTestingModule({
      imports: [NewAddress],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: GoogleMapsService, useValue: googleMapsServiceMock },
        { provide: Actions, useValue: actionsSubject },
        provideTranslateService({
          fallbackLang: "en",
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAddress);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    actionsSubject.complete();
    vi.restoreAllMocks();
  });

  // Initialization

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with step 1", () => {
    expect(component.currentStep()).toBe(1);
  });

  it("should initialize with an empty form", () => {
    expect(component.addressForm.getRawValue()).toEqual({
      title: "",
      city: "",
      street: "",
      phone: "",
      isPrimary: false,
    });
  });

  it("should load Google Maps on init", () => {
    expect(googleMapsServiceMock.load).toHaveBeenCalled();
  });

  it("should not move to step 2 if form is invalid", () => {
    component.nextStep();

    expect(component.currentStep()).toBe(1);
    expect(component.addressForm.touched).toBe(true);
  });

  it("should move to step 2 if form is valid", () => {
    component.addressForm.setValue({
      title: "Home",
      city: "Cairo",
      street: "Nasr City",
      phone: "01012345678",
      isPrimary: false,
    });

    component.nextStep();

    expect(component.currentStep()).toBe(2);
  });

  it("should return to step 1 when back is called", () => {
    component.currentStep.set(2);

    component.back();

    expect(component.currentStep()).toBe(1);
  });

  // Create Address
  it("should dispatch createAddress with the correct payload", () => {
    component.addressForm.setValue({
      title: "Home",
      city: "Cairo",
      street: "Nasr City",
      phone: "01012345678",
      isPrimary: true,
    });

    component.marker.set({
      lat: 30.0444,
      lng: 31.2357,
    });

    component.addAddress();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.createAddress({
        payload: {
          title: "Home",
          city: "Cairo",
          street: "Nasr City",
          phone: "01012345678",
          isPrimary: true,
          latitude: 30.0444,
          longitude: 31.2357,
        },
      }),
    );
  });

  it("should not dispatch createAddress when form is invalid", () => {
    component.marker.set({
      lat: 30.0444,
      lng: 31.2357,
    });

    component.addAddress();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
    expect(component.addressForm.touched).toBe(true);
  });

  it("should not dispatch createAddress when marker is missing", () => {
    component.addressForm.setValue({
      title: "Home",
      city: "Cairo",
      street: "Nasr City",
      phone: "01012345678",
      isPrimary: false,
    });

    component.addAddress();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });

  // Update Address
  it("should dispatch updateAddress when editing an existing address", () => {
    fixture.componentRef.setInput("address", mockAddress);
    fixture.componentRef.setInput("visible", true);
    fixture.detectChanges();

    component.addressForm.setValue({
      title: "Work",
      city: "Alexandria",
      street: "Stanley",
      phone: "01112345678",
      isPrimary: false,
    });

    component.marker.set({
      lat: 31.2001,
      lng: 29.9187,
    });

    component.addAddress();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      AddressActions.updateAddress({
        id: mockAddress.id,
        payload: {
          title: "Work",
          city: "Alexandria",
          street: "Stanley",
          phone: "01112345678",
          isPrimary: false,
          latitude: 31.2001,
          longitude: 29.9187,
        },
      }),
    );
  });

  it("should identify edit mode when address exists", () => {
    fixture.componentRef.setInput("address", mockAddress);
    fixture.detectChanges();

    expect(component.isEdit()).toBe(true);
  });

  it("should identify create mode when address is null", () => {
    expect(component.isEdit()).toBe(false);
  });

  it("should patch form values when editing an address", () => {
    fixture.componentRef.setInput("address", mockAddress);
    fixture.componentRef.setInput("visible", true);
    fixture.detectChanges();

    expect(component.addressForm.getRawValue()).toEqual({
      title: mockAddress.title,
      city: mockAddress.city,
      street: mockAddress.street,
      phone: mockAddress.phone,
      isPrimary: true,
    });
  });

  it("should reset the form when opening a new address modal", () => {
    fixture.componentRef.setInput("address", mockAddress);
    fixture.componentRef.setInput("visible", true);
    fixture.detectChanges();

    fixture.componentRef.setInput("address", null);
    fixture.detectChanges();

    expect(component.addressForm.getRawValue()).toEqual({
      title: "",
      city: "",
      street: "",
      phone: "",
      isPrimary: false,
    });

    expect(component.marker()).toBeNull();
  });

  // Close & Reset
  it("should emit false when closing the modal", () => {
    const spy = vi.spyOn(component.changeVisibility, "emit");

    component.close();

    expect(spy).toHaveBeenCalledWith(false);
  });

  it("should reset the form when closing the modal", () => {
    component.addressForm.setValue({
      title: "Home",
      city: "Cairo",
      street: "Nasr City",
      phone: "01012345678",
      isPrimary: true,
    });

    component.marker.set({
      lat: 30.0444,
      lng: 31.2357,
    });

    component.currentStep.set(2);

    component.resetForm();

    expect(component.addressForm.getRawValue()).toEqual({
      title: "",
      city: "",
      street: "",
      phone: "",
      isPrimary: false,
    });

    expect(component.marker()).toBeNull();
    expect(component.currentStep()).toBe(1);
  });

  // NgRx Success Actions
  it("should close the modal and emit saved on create success", () => {
    const closeSpy = vi.spyOn(component, "close");
    const savedSpy = vi.spyOn(component.saved, "emit");

    actionsSubject.next({
      type: AddressActions.createAddressSuccess.type,
    });

    expect(closeSpy).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
  });

  it("should close the modal and emit saved on update success", () => {
    const closeSpy = vi.spyOn(component, "close");
    const savedSpy = vi.spyOn(component.saved, "emit");

    actionsSubject.next({
      type: AddressActions.updateAddressSuccess.type,
    });

    expect(closeSpy).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
  });

  // Map
  it("should update marker and center when map is clicked", () => {
    const position = {
      lat: 30.0444,
      lng: 31.2357,
    };

    component.onMapClick({
      latLng: {
        toJSON: () => position,
      },
    } as google.maps.MapMouseEvent);

    expect(component.marker()).toEqual(position);
    expect(component.center).toEqual(position);
  });

  it("should not update marker when map click has no coordinates", () => {
    component.onMapClick({
      latLng: null,
    } as google.maps.MapMouseEvent);

    expect(component.marker()).toBeNull();
  });

  // Geolocation
  it("should update marker and center when current location is found", () => {
    const position = {
      lat: 30.0444,
      lng: 31.2357,
    };

    const getCurrentPosition = vi.fn(
      (success: PositionCallback) => {
        success({
          coords: {
            latitude: position.lat,
            longitude: position.lng,
          },
        } as GeolocationPosition);
      },
    );

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    component.findMyLocation();

    expect(component.marker()).toEqual(position);
    expect(component.center).toEqual(position);
    expect(component.zoom).toBe(16);
    expect(component.isLocating()).toBe(false);
  });

  it("should set an error when geolocation is not supported", () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });

    component.findMyLocation();

    expect(component.locationError()).toBe(
      "Your browser doesn't support geolocation",
    );

    expect(component.isLocating()).toBe(false);
  });

  it("should handle geolocation permission denied", () => {
    const getCurrentPosition = vi.fn(
      (
        _success: PositionCallback,
        error: PositionErrorCallback,
      ) => {
        error({
          code: 1,
          PERMISSION_DENIED: 1,
        } as GeolocationPositionError);
      },
    );

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    component.findMyLocation();

    expect(component.locationError()).toBe(
      "Location permission denied. Please allow access from your browser settings.",
    );

    expect(component.isLocating()).toBe(false);
  });

  it("should handle other geolocation errors", () => {
    const getCurrentPosition = vi.fn(
      (
        _success: PositionCallback,
        error: PositionErrorCallback,
      ) => {
        error({
          code: 2,
          PERMISSION_DENIED: 1,
        } as GeolocationPositionError);
      },
    );

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    component.findMyLocation();

    expect(component.locationError()).toBe(
      "Couldn't get your location. Please try again.",
    );

    expect(component.isLocating()).toBe(false);
  });
});
