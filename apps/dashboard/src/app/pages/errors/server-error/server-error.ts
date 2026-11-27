import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error',
  imports: [TranslatePipe],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {}
