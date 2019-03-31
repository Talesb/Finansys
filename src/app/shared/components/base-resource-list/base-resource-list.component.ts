import { OnInit } from '@angular/core';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../model/base-resource.model';



export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    constructor(private resourceService: BaseResourceService<T>) { }


    resources: T[] = [];

    ngOnInit() {
        this.resourceService.getAll()
            .subscribe(resources => this.resources =
                resources.sort((a, b) => b.id - a.id), error => alert('Erro ao carregar a lista: ' + error.statusText));
    }

    deleteResource(resource: T) {
        const mustDelete = confirm('Deseja Realmente excluir este item?');
        if (mustDelete) {
            this.resourceService.delete(resource.id)
                .subscribe(
                    () => this.resources = this.resources.filter(element => element !== resource),
                    error => alert('Erro ao tentar excluir: ' + error));
        }
    }

}
