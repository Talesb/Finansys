import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/services/entry.service';
import { Entry } from '../shared/model/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  constructor(private entryService: EntryService) { }


  entries: Entry[] = [];

  ngOnInit() {
    this.entryService.getAll()
      .subscribe(entries => this.entries = entries, error => alert('Erro ao carregar a lista: ' + error));
  }


  deleteEntry(entry: Entry) {

    const mustDelete = confirm('Deseja Realmente excluir este item?');

    if (mustDelete) {
      this.entryService.delete(entry.id)
        .subscribe(
          () => this.entries = this.entries.filter(element => element !== entry),
          error => alert('Erro ao tentar excluir: ' + error));
    }
  }

}
