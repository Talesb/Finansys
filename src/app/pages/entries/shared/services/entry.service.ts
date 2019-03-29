import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Entry } from '../model/entry.model';

import { map, catchError, flatMap } from 'rxjs/operators';
import { CategoryService } from 'src/app/pages/categories/shared/services/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath = 'api/entries';

  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = this.apiPath + '/' + id;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {

    // Observable, o flatmap ira achatar e irá restornar o observable interno
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        // Observable contendo um entry
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    )


  }

  update(entry: Entry): Observable<Entry> {
    const url = this.apiPath + '/' + entry.id;

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        )
      })
    )



  }


  delete(id: number): Observable<any> {
    const url = this.apiPath + '/' + id;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }




  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });
    return entries;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição: ' + error);
    return throwError(error);
  }

  private jsonDataToEntry(jsonData: any) {
    return Object.assign(new Entry(), jsonData);
  }

}
