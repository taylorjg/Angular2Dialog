import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { NameListItem } from "./nameListItem";

@Injectable()
export class NameListService {
    constructor(private http: Http) {
    }
    readAll(): Observable<NameListItem[]> {
        return this.http
            .get("/api/nameList")
            .map(response => <NameListItem[]>response.json());
    }
    create(item: NameListItem): Observable<Response> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options = { headers: headers };
        return this.http.post("/api/nameList", JSON.stringify(item), options);
    }
    update(item: NameListItem): Observable<Response> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const options = { headers: headers };
        return this.http.post(item.updateUri, JSON.stringify(item), options);
    }
    delete(item: NameListItem): Observable<Response> {
        return this.http.delete(item.deleteUri);
    }
}
