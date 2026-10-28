import { Component, computed, input } from "@angular/core";

type AvatarSize = "sm" | "md" | "lg";

@Component({
  selector: "app-avatar",
  imports: [],
  templateUrl: "./avatar.html",
  styleUrl: "./avatar.css",
})
export class Avatar {
  readonly size = input<AvatarSize>("md");
  readonly name = input.required<string | null | undefined>();

  protected readonly letter = computed(() => {
    const text = this.name()?.trim();
    if (!text) return "";

    const [firstLetter] = text; // safer than text[0] for emojis
    return firstLetter.toLocaleUpperCase();
  });

  protected readonly sizeClass = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      sm: "size-8 text-sm",
      md: "size-10 text-base",
      lg: "size-14 text-xl",
    };
    return sizes[this.size()];
  });
}
