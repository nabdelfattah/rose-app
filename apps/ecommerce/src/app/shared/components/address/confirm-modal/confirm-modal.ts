import { Component, input, output } from '@angular/core';
import { LucideTrash } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { Button } from '@rose-app/ui';

@Component({
  selector: 'app-confirm-modal',
  imports: [DialogModule, LucideTrash, Button, TranslatePipe],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css'
})
export class ConfirmModal {

  visible = input.required<boolean>();
  changeVisibility = output<boolean>();
  confirm = output();
  cancel = output();

  
}
