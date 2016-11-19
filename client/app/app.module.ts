import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {NameListComponent} from './homePage/nameList.component';
import {NameListItemModalContentComponent} from './homePage/nameListItemModalContent.component';
import {VersionService} from './homePage/version.service';
import {NameListService} from './homePage/nameList.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgbModule.forRoot()],
    declarations: [
        AppComponent,
        NameListComponent,
        NameListItemModalContentComponent],
    entryComponents: [NameListItemModalContentComponent],
    providers: [VersionService, NameListService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
