import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import currencyFormatter from 'currency-formatter';
import { Category } from '../../categories/shared/model/category.model';
import { Entry } from '../../entries/shared/model/entry.model';
import { EntryService } from '../../entries/shared/services/entry.service';
import { CategoryService } from '../../categories/shared/services/category.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [
        { ticks: { beginAtZero: true } }
      ]
    }
  }

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;


  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories)
  }


  generateReports() {
    let month = this.month.nativeElement.value;
    let year = this.month.nativeElement.value;

    if (!month || !year) {
      alert('Você precisa selecionar o mÊs e o ano para gerar os relatórios');
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this));
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type == 'revenue')
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
      else
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' });
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' });
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' });
  }


  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9ccc65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Desepesas', '#e03131');
  }

  getChartData(entryType: string, title: string, bgColor: string) {
    const chartData = [];

    this.categories.forEach(category => {
      const filteredEntries = this.entries
        .filter(entry => (entry.categoryId == category.id) && (entry.type == entryType));


      //  Se achou lançamentos, some os valores a adciona no chartdata
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
        console.log(chartData);
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: bgColor,
        data: chartData.map(item => item.totalAmount)
      }]
    }


  }
}
