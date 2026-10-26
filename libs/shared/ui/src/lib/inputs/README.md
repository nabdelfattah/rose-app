# `app-input`

A labeled text field for reactive forms. It shows its own validation messages, has a show/hide toggle for passwords, and includes an Egyptian phone picker for `type="tel"`.

Source: [`inputs.ts`](./inputs.ts) · [`inputs.html`](./inputs.html)

---

## Quick start

### 1. Import the component

The class is called `Input`, which is the same name as Angular's `@Input` decorator. Import it under an alias to avoid the clash:

```ts
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Input as AppInput } from "@rose-app/ui";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule, AppInput],
  templateUrl: "./login.html",
})
export class Login {
  private readonly fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });
}
```

### 2. Use it in the template

Give each field its `FormControl` through `[control]`. With a form group, that's `form.controls.<name>`:

```html
<form [formGroup]="loginForm" (ngSubmit)="submit()">
  <div class="flex flex-col gap-4">
    <app-input
      id="email"
      label="Email"
      type="email"
      placeholder="user@example.com"
      [control]="loginForm.controls.email"
    />

    <app-input
      id="password"
      label="Password"
      type="password"
      placeholder="********"
      [control]="loginForm.controls.password"
    />
  </div>
</form>
```

> **Don't use `formControlName`.** `app-input` isn't a form control directive (it doesn't implement `ControlValueAccessor`), so `formControlName="email"` won't work. Always pass the control with `[control]`.

---

## Inputs (API)

| Input | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | ✅ | — | The `<input>` id. It also connects the `<label>` to the field. Must be unique on the page. |
| `label` | `string` | ✅ | — | Label text. It also appears in the "required" error message ("Your **Email** is required"). |
| `control` | `FormControl` | ✅ | — | The form control this field reads from and writes to. |
| `type` | `"text" \| "email" \| "password" \| "number" \| "tel" \| "textarea"` | | `"text"` | The type of field. `password`, `tel` and `textarea` add extra behavior (see below). |
| `rows` | `number` | | `4` | Visible lines of text. Only used when `type="textarea"`. |
| `placeholder` | `string` | | `""` | Placeholder text. |
| `helperText` | `string` | | `""` | Small gray hint text under the field. |
| `value` | `string` | | `""` | ⚠️ Don't use this. Set the starting value on the `FormControl` instead (see [Gotchas](#gotchas)). |
| `readonly` | `boolean` | | `false` | ⚠️ Declared in the component but not wired up in the template yet, so it has no effect. |

---

## Validation messages

Messages appear only after the field is **touched** (the user focused it and then left it). To show every error at once when the form is submitted, call `form.markAllAsTouched()`.

The component chooses the message from the error on the control:

| Error on the control | Validator to add | Message shown |
|---|---|---|
| `required` | `Validators.required` | `Your {label} is required` (the border also turns red) |
| `email` | `Validators.email` | `Please Enter Valid Email` |
| `pattern` with `type="tel"` | `Validators.pattern(...)` | `Accept Egyption Numbers Only` |
| `pattern` with `type="textarea"` | `Validators.pattern(...)` | Nothing (show your own message) |
| `pattern` with any other type | `Validators.pattern(...)` | A three-item password rules list (8+ chars, uppercase, special character) |

Errors not in this table are **not displayed**, even though they still make the form invalid. That includes `minlength`, `maxlength`, `min`, `max` and custom validators. If you need one of those, show your own message under the component:

```html
<app-input id="username" label="Username" [control]="form.controls.username" />
@if (form.controls.username.hasError("minlength") && form.controls.username.touched) {
  <p class="text-red-600">Must be at least 3 characters</p>
}
```

The messages are fixed text. There's no input for passing custom messages.

---

## Field types

### Text / email / number

```html
<app-input id="firstName" label="First name" [control]="form.controls.firstName" />
<app-input id="email" label="Email" type="email" [control]="form.controls.email" />
<app-input id="age" label="Age" type="number" [control]="form.controls.age" />
```

### Password

`type="password"` adds an eye button that shows and hides the password.

Add a `pattern` validator to show the password rules list. This pattern matches the rules the list displays:

```ts
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

form = this.fb.nonNullable.group({
  password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
});
```

```html
<app-input id="password" label="Password" type="password" [control]="form.controls.password" />
```

For a **confirm password** field, use a separate control and a group-level validator that compares the two. The component won't show that error, so render the message yourself as in the `minlength` example above.

### Textarea

`type="textarea"` renders a `<textarea>` instead of an `<input>`. Use `rows` to set its height. The user can still drag it taller.

```html
<app-input
  id="content"
  label="Review"
  type="textarea"
  [rows]="6"
  placeholder="Tell us what you think"
  [control]="form.controls.content"
/>
```

`[value]` is ignored for textareas. Set the starting value on the control.

### Phone (`tel`)

`type="tel"` turns the field into an [intl-tel-input](https://intl-tel-input.com/) phone picker. It's locked to Egypt: the 🇪🇬 +20 prefix shows as a separate badge, and `strictMode` blocks typing anything other than digits.

```ts
form = this.fb.nonNullable.group({
  phone: ["", [Validators.required, Validators.pattern(/^0?1[0125]\d{8}$/)]],
});
```

```html
<app-input id="phone" label="Phone" type="tel" placeholder="1012345678" [control]="form.controls.phone" />
```

Things to know:

- **The control value doesn't include the country code.** The `+20` badge is outside the text, so the control holds only what the user typed, for example `01012345678` or `1012345678`. Add `+20` yourself if your API expects it.
- **`strictMode` doesn't validate the number.** It only limits which characters can be typed. Add a `Validators.pattern` (like the one above) to get the "Accept Egyption Numbers Only" message.
- **Stylesheet required.** The app that renders the page must load the intl-tel-input styles in its global `styles.css`:
  ```css
  @import "intl-tel-input/styles";
  ```
  `apps/ecommerce` has this, but **`apps/shell` doesn't**. When ecommerce pages load inside the shell (port 4200), only the shell's global styles are on the page, so the phone picker looks unstyled. Add the import to `apps/shell/src/styles.css` (and to `apps/dashboard` if it uses phone fields).
- The picker only starts in the browser. During server-side rendering it's a plain `<input type="tel">`.

---

## Full example: register form

```ts
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Input as AppInput } from "@rose-app/ui";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const egyptPhonePattern = /^0?1[0125]\d{8}$/;

@Component({
  selector: "app-register",
  imports: [ReactiveFormsModule, AppInput],
  templateUrl: "./register.html",
})
export class Register {
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required, Validators.pattern(egyptPhonePattern)]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show every error at once
      return;
    }
    const { phone, ...rest } = this.form.getRawValue();
    // add the country code if the API expects it
    const payload = { ...rest, phone: `+20${phone.replace(/^0/, "")}` };
    // ...dispatch / call the service with payload
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
  <div class="grid grid-cols-2 gap-4">
    <app-input id="firstName" label="First name" [control]="form.controls.firstName" />
    <app-input id="lastName" label="Last name" [control]="form.controls.lastName" />
  </div>
  <app-input id="email" label="Email" type="email" [control]="form.controls.email" />
  <app-input id="phone" label="Phone" type="tel" [control]="form.controls.phone" />
  <app-input
    id="password"
    label="Password"
    type="password"
    helperText="Use at least 8 characters"
    [control]="form.controls.password"
  />
  <button type="submit">Create account</button>
</form>
```

---

## Gotchas

- **Name clash with `@Input`.** Import the component as `Input as AppInput` (or another alias). Otherwise it collides with Angular's `Input` decorator if you also import that.
- **Use `[control]`, not `formControlName`.** See [Quick start](#2-use-it-in-the-template).
- **Don't use `[value]`.** The field gets its value from the form control, so a `value` passed in can be overwritten or get out of sync with the control. Set starting values on the control instead: `this.fb.group({ email: ["user@example.com"] })`, or call `form.patchValue({...})` later (for example, after loading a profile).
- **Disabling.** Call `control.disable()` / `control.enable()`. The component has no `disabled` input. Disabled controls are left out of `form.value`, so use `form.getRawValue()` if you need their values.
- **Red border only for `required`.** Other errors show a message but keep the normal border color.
- **`helperText` with passwords.** The eye button is positioned from the bottom of the field's wrapper, and the helper text sits inside that wrapper. With both on a password field, the eye button drops below the input. Avoid using `helperText` on password fields until this is fixed.
- **Any `pattern` error on a non-tel field shows the password rules.** If you add a pattern to a username or text field, the error will show the password list. Show your own message for those fields instead (see [Validation messages](#validation-messages)).
