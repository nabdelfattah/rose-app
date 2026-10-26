import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Button } from "@rose-app/ui";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, RouterLink, Button, Footer, Header],
  templateUrl: "./main-layout.html",
})
export class MainLayout {}

