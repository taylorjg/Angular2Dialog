import {Component, ViewContainerRef} from '@angular/core';

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
    // You need this small hack in order to catch application root view container ref
    public viewContainerRef: ViewContainerRef;
    public constructor(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
