import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NameListComponent} from './home/nameList.component';
import {NameListService} from './home/nameList.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule],
    declarations: [
        AppComponent,
        NameListComponent],
    providers: [NameListService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
