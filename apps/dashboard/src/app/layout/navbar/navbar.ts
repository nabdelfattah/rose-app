import { Component, inject } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { UserMenu } from '../../shared/components/user-menu/user-menu';
import { Session } from '../../core/services/session';


@Component({
  selector: 'app-navbar',
  imports: [Breadcrumb, UserMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar{

  private readonly session = inject(Session);

  readonly user = this.session.getUser();
}
