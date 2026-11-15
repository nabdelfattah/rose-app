import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from "@angular/core";
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "@openng/optimus-ui/button";
import { DialogModule } from "@openng/optimus-ui/dialog";
import { Button, Input } from "@rose-app/ui";
import { PaymentStepper } from "../../payment-stepper/payment-stepper";
import { GoogleMap, MapMarker } from "@angular/google-maps";
import { LucideArrowLeft, LucideMapPinHouse } from "@lucide/angular";
import { GoogleMapsService } from "../services/google-maps/google-maps.service";
import { Store } from "@ngrx/store";
import { environment } from "../../../../../environments/environment";
import { AddressActions } from "../store/address.actions";
import { selectAddresses } from "../store/address.selector";
import { Address } from "../model/address.model";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-new-address",
  imports: [
    ButtonModule,
    DialogModule,
    Button,
    Input,
    ReactiveFormsModule,
    PaymentStepper,
    LucideArrowLeft,
    LucideMapPinHouse,
    GoogleMap,
    MapMarker,
    TranslatePipe
  ],
  templateUrl: "./new-address.html",
  styleUrl: "./new-address.css",
})
export class NewAddress implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly loader = inject(GoogleMapsService);
  private readonly store = inject(Store);
  private readonly allAddresses = this.store.selectSignal(selectAddresses);
  private readonly actions$ = inject(Actions);

  visible = input(false);
  address = input<Address | null>(null);
  changeVisibility = output<boolean>();
  saved = output<void>();
  currentStep = signal<number>(1);
  isLocating = signal(false);
  locationError = signal<string | null>(null);
  isEdit = computed(() => !!this.address());
  title = computed(() =>
    this.isEdit() ? "address.new-address.update-title" : "address.new-address.add-title",
  );

  // Map
  mapsReady = signal(false);
  center: google.maps.LatLngLiteral = { lat: 30.0444, lng: 31.2357 };
  zoom = 12;
  marker = signal<google.maps.LatLngLiteral | null>(null);

  // form
  addressForm = this.fb.group({
    title: ["", Validators.required],
    city: ["", Validators.required],
    street: ["", Validators.required],
    phone: ["", Validators.required],
    isPrimary: [false],
  });

  constructor() {
    effect(() => {
      const data = this.address();
      const visible = this.visible();
      if (!visible) return;

      this.currentStep.set(1);

      if (data) {
        this.addressForm.patchValue({
          title: data.title,
          city: data.city,
          street: data.street,
          phone: data.phone,
          isPrimary: data.isPrimary ?? false,
        });
        if (data.latitude && data.longitude) {
          const pos = { lat: +data.latitude, lng: +data.longitude };
          this.marker.set(pos);
          this.center = pos;
        }
      } else {
        this.addressForm.reset({ isPrimary: false });
        this.marker.set(null);
      }
    });

    this.actions$
      .pipe(
        ofType(
          AddressActions.createAddressSuccess,
          AddressActions.updateAddressSuccess,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.close();
        this.saved.emit();
      });
  }

  get titleControl() {
    return this.addressForm.get("title") as FormControl;
  }

  get cityControl() {
    return this.addressForm.get("city") as FormControl;
  }

  get streetControl() {
    return this.addressForm.get("street") as FormControl;
  }

  get phoneControl() {
    return this.addressForm.get("phone") as FormControl;
  }

  async ngOnInit() {
    try {
      await this.loader.load(environment.googleMapKey);
      this.mapsReady.set(true);
    } catch (e) {
      console.error(e);
    }
  }

  nextStep() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.currentStep.set(2);
  }

  back() {
    this.currentStep.set(1);
  }

  addAddress() {
    if (this.addressForm.invalid || !this.marker()) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const position = this.marker()!;
    const payload = {
      ...this.addressForm.getRawValue(),
      latitude: position.lat,
      longitude: position.lng,
    };

    const current = this.address();
    if (current) {
      this.store.dispatch(
        AddressActions.updateAddress({ id: current.id, payload }),
      );
    } else {
      this.store.dispatch(AddressActions.createAddress({ payload }));
    }
  }

  close() {
    this.resetForm();
    this.changeVisibility.emit(false);
  }

  resetForm() {
    this.addressForm.reset({
      title: "",
      city: "",
      street: "",
      phone: "",
      isPrimary: false,
    });
    this.marker.set(null);
    this.currentStep.set(1);
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.marker.set(position);
      this.center = position;
    }
  }

  // Find Current Location
  findMyLocation() {
  if (!navigator.geolocation) {
    this.locationError.set("Your browser doesn't support geolocation");
    return;
  }

  this.isLocating.set(true);
  this.locationError.set(null);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      this.center = position;
      this.zoom = 16;
      this.marker.set(position);
      this.isLocating.set(false);
    },
    (err) => {
      this.isLocating.set(false);
      this.locationError.set(
        err.code === err.PERMISSION_DENIED
          ? "Location permission denied. Please allow access from your browser settings."
          : "Couldn't get your location. Please try again."
      );
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
}
