import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/services/entry.service';
import { Entry } from '../shared/model/entry.model';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {
  constructor(private entryService: EntryService) {
    super(entryService);
  }
}
