import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VersionService {
    constructor(private http: Http) {
    }
    get(): Observable<string> {
        return this.http
            .get('/api/version')
            .map(response => response.json().version);
    }
}
