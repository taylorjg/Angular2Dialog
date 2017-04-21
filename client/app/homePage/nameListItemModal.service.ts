import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NameListItem } from "./nameListItem";
import { NameListItemModalContentComponent } from "./nameListItemModalContent.component";

@Injectable()
export class NameListItemModalService {
    constructor(private modalService: NgbModal) {
    }
    public editItem(item: NameListItem): NgbModalRef {
        const modalRef = this.modalService.open(NameListItemModalContentComponent);
        modalRef.componentInstance.item = item;
        return modalRef;
    }
    public addItem(): NgbModalRef {
        const modalRef = this.modalService.open(NameListItemModalContentComponent);
        return modalRef;
    }
}
