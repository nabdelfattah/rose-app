import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Button } from "@rose-app/ui";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, Button],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {}
