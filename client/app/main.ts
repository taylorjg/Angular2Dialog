/// <reference path="../../typings/index.d.ts" />

import {bootstrap} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {AppComponent} from "./app.component";

// ngClass not setting from Component Method
// https://github.com/angular/angular/issues/7426
enableProdMode();

bootstrap(AppComponent, [HTTP_PROVIDERS]);
