import { BaseResourceModel } from '../model/base-resource.model';
import { map, catchError, flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injector } from '@angular/core';


export abstract class BaseResourceService<T extends BaseResourceModel> {

    constructor(protected apiPath: string,
                protected injector: Injector,
                protected jsonDataToResourceFn: (jsonData: any) => T) {
        this.http = injector.get(HttpClient);
    }

    protected http: HttpClient;

    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<T> {
        const url = this.apiPath + '/' + id;
        return this.http.get(url).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        );
    }

    update(resource: T): Observable<T> {
        const url = this.apiPath + '/' + resource.id;
        return this.http.put(url, resource).pipe(
            map(() => resource),
            catchError(this.handleError)
        );
    }


    delete(id: number): Observable<any> {
        const url = this.apiPath + '/' + id;
        return this.http.delete(url).pipe(
            map(() => null),
            catchError(this.handleError)
        );
    }

    // Private Methods

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
        return resources;
    }

    protected jsonDataToResource(jsonData: any) {
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any> {
        console.log('Erro na requisição: ' + error);
        return throwError(error);
    }




}
