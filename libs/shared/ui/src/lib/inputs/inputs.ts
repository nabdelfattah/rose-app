import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms"
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LucideEye, LucideEyeOff, TranslatePipe],
  templateUrl: './inputs.html',
})
export class Input implements AfterViewInit{
    private platformId = inject(PLATFORM_ID);
    label = input.required<string>();
    type = input<"text" | "email" | "password" | "number" | "tel">("text");
    placeholder = input<string>("");
    value = input<string>("");
    control = input.required<FormControl>();
    id = input.required<string>();
    helperText = input<string>('');
    readonly = input<boolean>(false);
    showPassword = signal<boolean>(false);


    @ViewChild('input') phoneInput!: ElementRef<HTMLInputElement>;

    toggleType(){
      if(!this.showPassword()){
        this.phoneInput.nativeElement.type = "text"
        this.showPassword.set(true);
      }else{
        this.phoneInput.nativeElement.type = "password"
        this.showPassword.set(false);
      }
    }

  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)){
      if(this.type() === "tel"){
        intlTelInput(this.phoneInput.nativeElement, {
          initialCountry: 'eg',
          separateDialCode: true,
          onlyCountries:['eg'],
          strictMode: true,
          containerClass: "w-full"
        });
      }
    }
  }
  
}