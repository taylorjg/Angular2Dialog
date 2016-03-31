import {Component} from "angular2/core";
import {NameListComponent} from "./home/nameList.Component";

@Component({
    selector: "app",
    template: `
        <br />
        <br />
        <div class="container">
            <nameList></nameList>
        </div>`,
    directives: [NameListComponent]
})
export class AppComponent {
}
