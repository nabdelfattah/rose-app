# 🌹 Rose App

An e-commerce web app for selling flowers. Customers can browse bouquets, keep favourites in a wishlist, add items to a cart, check out, track their orders, and manage their account.

The project is an **Nx monorepo** built as **micro-frontends** with Angular and Native Federation: a `shell` host app loads the `ecommerce` (and later `dashboard`) remote apps at runtime.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Folder structure](#folder-structure)
- [Getting started](#getting-started)
- [Using Lucide icons](#using-lucide-icons)
- [Using Optimus UI](#using-optimus-ui)
- [Useful links](#useful-links)

---

## Features

| Feature | Route | Description |
| --- | --- | --- |
| Home | `/` | Landing page with featured flowers and offers |
| Products | `/products` | Browse, search, and filter the flower catalogue |
| Wishlist | `/wishlist` | Save favourite items to buy later |
| Cart | `/cart` | Add, remove, and change the quantity of items |
| Checkout | `/checkout` | Enter shipping details and place an order |
| Orders | `/orders` | View past orders and their status |
| Account | `/account` | Update the user's personal data and change password |
| Login / Register | `/login`, `/register` | User authentication |
| Forgot / Reset password | `/forget-password`, `/reset-password` | Recover access to an account |
| Not found | `/**` | Fallback page for unknown routes |

---

## Tech stack

| Tool | Role in the project |
| --- | --- |
| **[Angular 22](https://angular.dev)** | The front-end framework. Every app is built from standalone components, signals, and the Angular router (lazy-loaded routes). |
| **[Angular SSR](https://angular.dev/guide/ssr)** + **Express** | Server-side rendering for the `shell` and `ecommerce` apps, which gives faster first paint and better SEO for product pages. Express is the Node server that serves the rendered pages. |
| **[Nx 23](https://nx.dev)** | Monorepo tool. It manages the apps in one repo, runs tasks (`serve`, `build`, `test`, `lint`), caches results, and only rebuilds what changed. |
| **[Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation)** (`@angular-architects/native-federation`) | Micro-frontend setup. The `shell` app loads the `ecommerce` and `dashboard` remotes at runtime through `remoteEntry.json` files, so each app can be developed and deployed on its own. |
| **[NgRx](https://ngrx.io)** (Store, Effects, Store Devtools) | Global state management for things shared across pages, such as the cart, wishlist, and logged-in user. Effects handle side effects like API calls. Devtools lets you inspect state in the browser via the Redux DevTools extension. |
| **[RxJS](https://rxjs.dev)** | Reactive streams, used for HTTP calls, NgRx effects, and async flows. |
| **[Optimus UI](https://optimus.openng.org/)** (`@openng/optimus-ui`) | UI component library (buttons, inputs, dialogs, tables, and so on). It is an open-source, API-compatible alternative to PrimeNG. Themed with the **Aura** preset from `@openng/optimus-ui-themes`. |
| **[Tailwind CSS 4](https://tailwindcss.com)** + PostCSS | Utility-first CSS for layout, spacing, and custom styling. It is wired through `@tailwindcss/postcss` in `.postcssrc.json` and imported in each app's `styles.css`. |
| **[Lucide](https://lucide.dev)** (`@lucide/angular`) | Icon library. Each icon is a standalone Angular component, and only the icons you import end up in the bundle. |
| **[Vitest](https://vitest.dev)** + jsdom | Unit test runner for the `*.spec.ts` files. |
| **ESLint** + Prettier config | Linting and consistent code style. |
| **TypeScript 6** | Static typing across the whole workspace. |
| **GitHub Actions** | CI pipeline (`.github/workflows/ci.yml`) that runs lint, test, and build on pull requests. |

---

## Architecture

```text
                    ┌──────────────────────────────┐
  Browser  ───────▶ │  shell  (host)   :4200       │
                    │  - SSR, Optimus theme setup  │
                    └──────────────┬───────────────┘
                                   │ loads at runtime (federation.manifest.json)
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
   ┌───────────────────────────┐       ┌───────────────────────────┐
   │ ecommerce (remote) :4201  │       │ dashboard (remote) :4202  │
   │ exposes ./routes          │       │ (scaffold, not wired yet) │
   └───────────────────────────┘       └───────────────────────────┘
```

- The remotes' URLs are listed in [apps/shell/public/federation.manifest.json](apps/shell/public/federation.manifest.json).
- The shell loads the ecommerce routes in [apps/shell/src/app/app.routes.ts](apps/shell/src/app/app.routes.ts). On the server it returns an empty catch-all route, and the browser loads the remote and resolves the real route.
- Global providers (router, NgRx store, Optimus theme) are set in each app's `app.config.ts`.

---

## Folder structure

```text
rose-app/
├── .github/workflows/ci.yml        # CI pipeline (lint, test, build)
├── .nx/                            # Nx cache and CI config
├── .postcssrc.json                 # PostCSS config that enables Tailwind
├── apps/
│   ├── shell/                      # HOST app: the entry point users open
│   │   ├── public/
│   │   │   └── federation.manifest.json   # Where to find each remote
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.config.ts          # Browser providers (router, NgRx, Optimus theme)
│   │   │   │   ├── app.config.server.ts   # Extra providers for SSR
│   │   │   │   ├── app.routes.ts          # Loads the ecommerce remote's routes
│   │   │   │   └── app.routes.server.ts   # Server render modes per route
│   │   │   ├── bootstrap.ts               # Bootstraps Angular (after federation init)
│   │   │   ├── main.ts                    # Initializes federation, then imports bootstrap
│   │   │   ├── main.server.ts             # SSR entry
│   │   │   ├── server.ts                  # Express server for SSR
│   │   │   └── styles.css                 # Global styles (Tailwind import)
│   │   ├── federation.config.mjs          # Native Federation config (shared deps)
│   │   └── project.json                   # Nx targets (serve, build, test, lint)
│   │
│   ├── ecommerce/                  # REMOTE app: the flower store
│   │   ├── src/app/
│   │   │   ├── core/               # App-wide singletons, used once
│   │   │   │   ├── guards/         # Route guards (e.g. auth guard for /account, /orders)
│   │   │   │   └── interceptors/   # HTTP interceptors (e.g. attach auth token, handle errors)
│   │   │   ├── features/           # One folder per page or feature (lazy-loaded)
│   │   │   │   ├── home/
│   │   │   │   ├── products/
│   │   │   │   ├── wishlist/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   ├── orders/
│   │   │   │   ├── account/        # Edit user data and change password
│   │   │   │   ├── auth/           # Auth pages and their own routes file
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── forget-password/
│   │   │   │   │   └── reset-password/
│   │   │   │   └── not-found/
│   │   │   ├── layout/             # Page shells that wrap feature pages
│   │   │   │   ├── main-layout/    # Header + <router-outlet> + footer
│   │   │   │   ├── auth-layout/    # Minimal layout for login/register pages
│   │   │   │   ├── header/
│   │   │   │   └── footer/
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts       # All ecommerce routes (exposed to the shell as ./routes)
│   │   └── federation.config.mjs   # Exposes ./routes to the shell
│   │
│   └── dashboard/                  # REMOTE app: reserved for the admin dashboard (scaffold)
│
├── eslint.config.mjs               # Root ESLint config
├── nx.json                         # Nx workspace config and task defaults
├── package.json                    # Dependencies and npm scripts
└── tsconfig.base.json              # Shared TypeScript config
```

### Conventions

- **Use kebab-case for every file and folder name.** Write names in lowercase with words separated by hyphens.

  | ✅ Do | ❌ Don't |
  | --- | --- |
  | `forget-password/` | `forgetPassword/`, `ForgetPassword/`, `forget_password/` |
  | `product-card.ts` | `productCard.ts`, `ProductCard.ts` |
  | `auth.routes.ts` | `authRoutes.ts`, `Auth.Routes.ts` |
  | `main-layout.html` | `mainLayout.html`, `main_layout.html` |

  Dots are only used to mark the file type (for example `.routes.ts`, `.spec.ts`, `.config.ts`). Class names inside the files still use PascalCase (for example `ForgetPassword`, `ProductCard`).

- **Each feature folder** contains one standalone component: `name.ts`, `name.html`, `name.css`, `name.spec.ts`.
- **Add new pages** under `features/` and register them in `app.routes.ts` with `loadComponent` so they are lazy-loaded.
- **Put anything used app-wide only once** (guards, interceptors, services that hold global state) in `core/`.
- **Put layout pieces** (header, footer, page wrappers) in `layout/`, not in `features/`.

---

## Getting started

### Prerequisites

- Node.js 24 (same version as CI)
- npm

### Install

```sh
npm install
```

### Run all apps

```sh
npm start
```

This serves `shell`, `ecommerce`, and `dashboard` together. Open **http://localhost:4200** (the shell).

| App | URL |
| --- | --- |
| shell | http://localhost:4200 |
| ecommerce | http://localhost:4201 |
| dashboard | http://localhost:4202 |

> The remotes must be running for the shell to load them.

### Other useful commands

```sh
npx nx serve ecommerce        # Serve a single app
npx nx build shell            # Production build of one app
npx nx run-many -t build      # Build every app
npx nx test ecommerce         # Run unit tests (Vitest)
npx nx lint ecommerce         # Lint an app
npx nx graph                  # Visualize the project graph
```

Generate a new component inside a feature:

```sh
npx nx g @nx/angular:component apps/ecommerce/src/app/features/products/product-card
```

---

## Using Lucide icons

Browse all icons at **https://lucide.dev/icons**. Every icon is its own standalone component named `Lucide` + the icon name in PascalCase (for example, `shopping-cart` becomes `LucideShoppingCart`). It is used as an attribute on an `<svg>` element.

### 1. Import the icon in the component

```ts
import { Component } from "@angular/core";
import { LucideShoppingCart, LucideHeart, LucideFlower } from "@lucide/angular";

@Component({
  selector: "app-product-card",
  imports: [LucideShoppingCart, LucideHeart, LucideFlower],
  templateUrl: "./product-card.html",
})
export class ProductCard {}
```

### 2. Use it in the template

```html
<!-- Default (24px, currentColor) -->
<svg lucideShoppingCart></svg>

<!-- Custom size, color, and stroke width -->
<svg lucideHeart [size]="20" color="#e11d48" [strokeWidth]="1.5"></svg>

<!-- Style with Tailwind classes (color comes from text-*) -->
<svg lucideFlower class="size-6 text-rose-500"></svg>

<!-- Accessible title for screen readers -->
<svg lucideHeart title="Add to wishlist"></svg>

<!-- Inside an Optimus button -->
<p-button>
  <svg lucideShoppingCart [size]="18"></svg>
  Add to cart
</p-button>
```

### Available inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | `24` | Width and height in px |
| `color` | `string` | `currentColor` | Stroke color |
| `strokeWidth` | `number \| string` | `2` | Line thickness |
| `title` | `string` | none | Accessible label |

### Dynamic icons (icon name decided at runtime)

Register the icons once with `provideLucideIcons`, then use the generic `lucideIcon` directive:

```ts
import { LucideDynamicIcon, provideLucideIcons, LucideTruck, LucidePackageCheck } from "@lucide/angular";

@Component({
  imports: [LucideDynamicIcon],
  providers: [provideLucideIcons(LucideTruck, LucidePackageCheck)],
  template: `<svg [lucideIcon]="order.delivered ? 'package-check' : 'truck'"></svg>`,
})
export class OrderStatus {}
```

📖 Full docs: https://lucide.dev/guide/packages/angular

---

## Using Optimus UI

Optimus UI is already configured in the shell with the **Aura** theme (see [apps/shell/src/app/app.config.ts](apps/shell/src/app/app.config.ts)). Its API matches PrimeNG, so PrimeNG examples work after you swap the import path (`primeng/button` becomes `@openng/optimus-ui/button`).

```ts
import { ButtonModule } from "@openng/optimus-ui/button";

@Component({
  imports: [ButtonModule],
  template: `<p-button label="Checkout" severity="success" />`,
})
export class CartSummary {}
```

📖 **Optimus UI documentation (components, demos, theming): https://optimus.openng.org/**

---

## Useful links

- Optimus UI docs: https://optimus.openng.org/
- Lucide icons: https://lucide.dev/icons
- Lucide Angular guide: https://lucide.dev/guide/packages/angular
- Angular docs: https://angular.dev
- NgRx docs: https://ngrx.io/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- Native Federation: https://www.npmjs.com/package/@angular-architects/native-federation
- Nx docs: https://nx.dev/getting-started/intro
