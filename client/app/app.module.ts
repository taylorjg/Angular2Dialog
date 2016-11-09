import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {AppComponent} from './app.component';
import {NameListComponent} from './home/nameList.component';
import {NameListItemModalComponent} from './home/nameListItemModal.component';
import {NameListService} from './home/nameList.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        Ng2BootstrapModule],
    declarations: [
        AppComponent,
        NameListComponent,
        NameListItemModalComponent],
    providers: [NameListService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
