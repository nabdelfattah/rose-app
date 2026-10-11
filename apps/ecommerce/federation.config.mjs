import { withNativeFederation, fromPackageJson } from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'ecommerce',



  exposes: {
    './routes': './apps/ecommerce/src/app/app.routes.ts',
    // './Component': './apps/ecommerce/src/app/app.ts',
  },

  shared: fromPackageJson({ singleton: true, strictVersion: true, requiredVersion: 'auto', build: 'package' })
    // includeSecondaries is an opt-out of ignoreUnusedDeps, so all of
    // @angular/core is shared to prevent mismatches.
    .patch(['@angular/core'], { includeSecondaries: { keepAll: true } })
    // Share every @openng/optimus-ui entry point in all apps so the shell and
    // remotes resolve to one copy (fix NG0912 worning and a lost theme config).
    .patch(['@openng/optimus-ui'], { includeSecondaries: { keepAll: true } }),

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // remove this line if you install optimus chart
    '@openng/optimus-ui/chart',
   // خلي كل app يضم نسخة من المكتبة داخل الـ bundle بتاعه
    '@rose-app/ui',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // ignoreUnusedDeps is enabled by default now
    // ignoreUnusedDeps: true,

    // Opt-in: groups chunks in remoteEntry.json for smaller metadata file
    denseChunking: true
  }
});
