import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/map";
import {NameListItem} from "./NameListItem";

@Injectable()
export class NameListService {
    constructor(private _http: Http) {
    }
    get(): Observable<NameListItem[]> {
        return this._http
            .get("/api")
            .map((response: Response) => <NameListItem[]>response.json());
    }
}
