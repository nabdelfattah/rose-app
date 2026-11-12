import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from "@angular/core";
import {
  LucideMapPin,
  LucidePenLine,
  LucidePhone,
  LucideTrash,
} from "@lucide/angular";
import { Store } from "@ngrx/store";
import { ButtonModule } from "@openng/optimus-ui/button";
import { DialogModule } from "@openng/optimus-ui/dialog";
import { Button } from "@rose-app/ui";
import {
  selectAddresses,
  selectSelectedAddressId,
} from "../store/address.selector";
import { AddressActions } from "../store/address.actions";
import { ConfirmModal } from "../confirm-modal/confirm-modal";
import { Address } from "../model/address.model";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-address-modal",
  imports: [
    ButtonModule,
    DialogModule,
    ConfirmModal,
    Button,
    LucideMapPin,
    LucidePhone,
    LucidePenLine,
    LucideTrash,
    TranslatePipe
  ],
  templateUrl: "./address-modal.html",
  styleUrl: "./address-modal.css",
})
export class AddressModal implements OnInit {
  readonly store = inject(Store);
  readonly allAddresses = this.store.selectSignal(selectAddresses);
  addressToDeleteId = signal<string | null>(null);
  readonly selectedAddressId = this.store.selectSignal(selectSelectedAddressId);

  editAddress = output<Address>();

  visible = input(false);
  changeVisibility = output<boolean>();
  addAddress = output();
  confirmModalVisible = signal(false);

  ngOnInit(): void {
    this.store.dispatch(AddressActions.loadAddresses());
  }

  openDeleteConfirmation(id: string) {
    this.addressToDeleteId.set(id);
    this.confirmModalVisible.set(true);
  }

  onConfirmDelete() {
    const id = this.addressToDeleteId();
    if (!id) return;
    this.store.dispatch(AddressActions.deleteAddress({ id }));
    this.confirmModalVisible.set(false);
  }

  selectAddress(id: string) {
    this.store.dispatch(AddressActions.selectAddress({ id }));
    this.changeVisibility.emit(false);
  }
}
