import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

import { Header } from "../header/header";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, Header],
  templateUrl: "./main-layout.html",
})
export class MainLayout {}
