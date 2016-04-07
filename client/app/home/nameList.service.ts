import {Injectable} from "angular2/core";
import {Http, Response, Headers} from "angular2/http";
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
    create(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = { headers: headers };
        return this._http.post("/api", JSON.stringify(item), options);
    }
    update(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = { headers: headers };
        return this._http.put("/api/" + item.id, JSON.stringify(item), options);
    }
    delete(item: NameListItem): Observable<Response> {
        return this._http.delete("/api/" + item.id);
    }
}
