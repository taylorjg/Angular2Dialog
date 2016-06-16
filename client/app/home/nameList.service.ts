import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/delay";
import {NameListItem} from "./NameListItem";

const SIMULATED_NETWORK_DELAY = 500;

@Injectable()
export class NameListService {
    constructor(private _http: Http) {
    }
    get(): Observable<NameListItem[]> {
        return this._http
            .get("/api")
            .delay(SIMULATED_NETWORK_DELAY)
            .map((response: Response) => <NameListItem[]>response.json());
    }
    create(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = { headers: headers };
        return this._http
            .post("/api", JSON.stringify(item), options)
            .delay(SIMULATED_NETWORK_DELAY);
    }
    update(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = { headers: headers };
        return this._http
            .put(`/api/${item.id}`, JSON.stringify(item), options)
            .delay(SIMULATED_NETWORK_DELAY);
    }
    delete(item: NameListItem): Observable<Response> {
        return this._http
            .delete(`/api/${item.id}`)
            .delay(SIMULATED_NETWORK_DELAY);
    }
}
