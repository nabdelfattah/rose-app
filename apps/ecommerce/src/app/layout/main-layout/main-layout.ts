import { Component, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Button } from "@rose-app/ui";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet],
  templateUrl: "./main-layout.html",
})
export class MainLayout {}
