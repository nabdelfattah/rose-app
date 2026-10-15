import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Button } from "./button";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "subtle"
  | "ghost"
  | "destructive";
type Size = "sm" | "md" | "lg" | "full";

@Component({
  imports: [Button],
  template: `
    <button
      appButton
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [disabled]="disabled()"
      [loading]="loading()"
      (click)="onClick()"
    >
      Save
    </button>
  `,
})
class ButtonHost {
  variant = signal<Variant>("primary");
  size = signal<Size>("md");
  type = signal<"button" | "submit" | "reset">("button");
  disabled = signal(false);
  loading = signal(false);
  onClick = vi.fn();
}

@Component({
  imports: [Button],
  template: `
    <a appButton href="/checkout" [disabled]="disabled()" [loading]="loading()">
      Checkout
    </a>
  `,
})
class LinkHost {
  disabled = signal(false);
  loading = signal(false);
}

@Component({
  imports: [Button],
  template: `
    <button appButton disabled>Static button</button>
    <a appButton href="/checkout" disabled>Static link</a>
  `,
})
class StaticAttributeHost {}

describe("Button", () => {
  describe("on <button>", () => {
    let fixture: ComponentFixture<ButtonHost>;
    let host: ButtonHost;
    let button: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      button = fixture.nativeElement.querySelector("button");
    });

    it("should create", () => {
      expect(button).toBeTruthy();
    });

    it("should project its content", () => {
      expect(button.textContent).toContain("Save");
    });

    it("should apply the primary variant and md size by default", () => {
      expect(button.classList).toContain("bg-maroon-600");
      expect(button.classList).toContain("text-white");
      expect(button.classList).toContain("h-11");
      expect(button.classList).toContain("px-5");
    });

    it("should have destructive variant classes when the variant set to destructive", () => {
      host.variant.set("destructive");
      fixture.detectChanges();
      expect(button.classList).toContain("bg-red-600");
      expect(button.classList).not.toContain("bg-maroon-600");
    });

    it("should reflect the provided type", () => {
      host.type.set("submit");
      fixture.detectChanges();
      expect(button.getAttribute("type")).toBe("submit");
    });

    it("should set the native disabled attribute when disabled", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      expect(button.disabled).toBe(true);
    });

    it("should not set link-only attributes when disabled", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      expect(button.hasAttribute("aria-disabled")).toBe(false);
      expect(button.hasAttribute("tabindex")).toBe(false);
    });

    it("should not emit clicks when disabled", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      button.click();
      expect(host.onClick).not.toHaveBeenCalled();
    });

    it("should set aria-busy and disable the button while loading", () => {
      host.loading.set(true);
      fixture.detectChanges();
      expect(button.getAttribute("aria-busy")).toBe("true");
      expect(button.disabled).toBe(true);
    });

    it("should re-enable the button and hide the spinner when loading ends", () => {
      host.loading.set(true);
      fixture.detectChanges();
      host.loading.set(false);
      fixture.detectChanges();
      expect(button.disabled).toBe(false);
      expect(button.hasAttribute("aria-busy")).toBe(false);
      expect(button.querySelector(".animate-spin")).toBeNull();
    });
  });

  describe("on <a>", () => {
    let fixture: ComponentFixture<LinkHost>;
    let host: LinkHost;
    let link: HTMLAnchorElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LinkHost],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      link = fixture.nativeElement.querySelector("a");
    });

    it("should create and keep the href", () => {
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe("/checkout");
      expect(link.textContent).toContain("Checkout");
    });

    it("should apply the default variant and size classes", () => {
      expect(link.classList).toContain("bg-maroon-600");
      expect(link.classList).toContain("h-11");
    });

    it("should be disabled and busy while loading", () => {
      host.loading.set(true);
      fixture.detectChanges();
      expect(link.getAttribute("aria-disabled")).toBe("true");
      expect(link.getAttribute("tabindex")).toBe("-1");
      expect(link.getAttribute("aria-busy")).toBe("true");
      expect(link.querySelector(".animate-spin")).not.toBeNull();
    });

    it("should remove the disabled attributes when re-enabled", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      host.disabled.set(false);
      fixture.detectChanges();
      expect(link.hasAttribute("aria-disabled")).toBe(false);
      expect(link.hasAttribute("tabindex")).toBe(false);
    });
  });

  describe("with a static disabled attribute", () => {
    let fixture: ComponentFixture<StaticAttributeHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StaticAttributeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(StaticAttributeHost);
      fixture.detectChanges();
    });

    // Disabled button
    it("should treat a bare disabled attribute as true on <button>", () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button.disabled).toBe(true);
    });

    // Disabled link
    it("should treat a bare disabled attribute as true on <a>", () => {
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector("a");
      expect(link.getAttribute("aria-disabled")).toBe("true");
      expect(link.getAttribute("tabindex")).toBe("-1");
    });
  });
});
