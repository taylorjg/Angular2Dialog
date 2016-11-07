import {Component, ViewContainerRef} from '@angular/core';
import {NameListComponent} from './home/nameList.Component';

@Component({
    selector: 'app',
    template: `
        <br />
        <br />
        <div class="container">
            <nameList></nameList>
        </div>`
})
export class AppComponent {
    public viewContainerRef: ViewContainerRef;
    public constructor(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
