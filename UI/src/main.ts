
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import 'hammerjs';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule).catch(err => console.error(err));
