import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import {NameListItem} from './NameListItem';

const SIMULATED_NETWORK_DELAY = 500;

@Injectable()
export class NameListService {
    constructor(private http: Http) {
    }
    get(): Observable<NameListItem[]> {
        return this.http
            .get('/api/nameList')
            .delay(SIMULATED_NETWORK_DELAY)
            .map((response: Response) => <NameListItem[]>response.json());
    }
    create(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = { headers: headers };
        return this.http
            .post('/api/nameList', JSON.stringify(item), options)
            .delay(SIMULATED_NETWORK_DELAY);
    }
    update(item: NameListItem): Observable<Response> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = { headers: headers };
        return this.http
            .post(`/api/nameList/${item.id}`, JSON.stringify(item), options)
            .delay(SIMULATED_NETWORK_DELAY);
    }
    delete(item: NameListItem): Observable<Response> {
        return this.http
            .delete(`/api/nameList/${item.id}`)
            .delay(SIMULATED_NETWORK_DELAY);
    }
}
