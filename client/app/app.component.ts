import {Component} from "@angular/core";
import {NameListComponent} from "./home/nameList.Component";
import {NameListService} from "./home/nameList.service";

@Component({
    selector: "app",
    template: `
        <br />
        <br />
        <div class="container">
            <nameList></nameList>
        </div>`,
    directives: [NameListComponent],
    providers: [NameListService]
})
export class AppComponent {
}
