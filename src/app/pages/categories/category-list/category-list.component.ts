import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/model/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }


  categories: Category[] = [];

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories, error => alert('Erro ao carregar a lista: ' + error));
  }


  deleteCategory(category: Category) {

    const mustDelete = confirm('Deseja Realmente excluir este item?');

    if (mustDelete) {
      this.categoryService.delete(category.id)
        .subscribe(
          () => this.categories = this.categories.filter(element => element !== category),
          error => alert('Erro ao tentar excluir: ' + error));
    }
  }

}
