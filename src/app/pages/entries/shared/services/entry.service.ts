import { Injectable, Injector } from '@angular/core';
import { Entry } from '../model/entry.model';
import { CategoryService } from 'src/app/pages/categories/shared/services/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));

  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Entry.fromJson(element);
      entries.push(entry);
    });
    return entries;
  }

  protected jsonDataToResource(jsonData: any) {
    return Entry.fromJson(jsonData);
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    )
  }
}
