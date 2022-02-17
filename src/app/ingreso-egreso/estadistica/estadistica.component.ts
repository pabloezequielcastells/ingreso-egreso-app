import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../model/ingreso-egreso.model';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: []
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor( private store: Store<AppState> ) {

      

  }

  ngOnInit(): void {
    this.store.select('ingresoEgreso')
        .subscribe( ({ items }) => this.generarEstadistica( items ))
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.egresos = 0;
    this.ingresos = 0;
    
    for(const item of  items) {
      if ( item.type === 'ingreso' ) {
        this.totalIngresos +=  item.amount;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.amount;
        this.egresos ++;
      }
    }

    this.doughnutChartData.datasets = [ { data: [this.totalIngresos, this.totalEgresos] } ];
  }

}
