import {Component} from "angular2/core";
import {NameListItem} from "./NameListItem";

@Component({
    selector: "nameList",
    template: 
        `<div class="row">
            <div class="col-md-10 col-md-offset-1">
                <table class="table table-striped table-condensed table-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="#item of nameListItems">
                            <td>{{item.id}}</td>
                            <td>{{item.firstName}}</td>
                            <td>{{item.lastName}}</td>
                            <td>{{item.email}}</td>
                            <td>
                                <button class="btn btn-primary btn-sm editBtn" (click)="onEditItem(item)">Edit</button>
                                <button class="btn btn-danger btn-sm deleteBtn" (click)="onDeleteItem(item)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr/>
                <button id="addItemBtn" class="btn btn-primary btn-sm" (click)="onAddItem()">Add Item</button>
            </div>
        </div>`
})
export class NameListComponent {
    nameListItems = [
        new NameListItem(0, "jon", "taylor", "jon.taylor@gmail.com"),
        new NameListItem(1, "janis", "joplin", "janis.joplin@gmail.com")
    ];
    onEditItem(item) {
        console.log("onEditItem", item.id);
    }
    onDeleteItem(item) {
        console.log("onDeleteItem", item.id);
    }
    onAddItem() {
        console.log("onAddItem");
    }
}
