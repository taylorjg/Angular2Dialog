/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />

import {bootstrap} from "angular2/platform/browser";
import {AppComponent} from "./app.component";
import {enableProdMode} from "angular2/core";

// ngClass not setting from Component Method
// https://github.com/angular/angular/issues/7426
enableProdMode();

bootstrap(AppComponent);
