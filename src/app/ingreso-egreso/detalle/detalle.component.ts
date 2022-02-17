import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../model/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubscription?: Subscription;
    
  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }
  
  ngOnInit(): void { 
    this.ingresosEgresosSubscription = this.store.select('ingresoEgreso').subscribe(
      ( { items } ) => { 
        this.ingresosEgresos = items;
      });
  }
    
  ngOnDestroy(): void {
    this.ingresosEgresosSubscription?.unsubscribe();
  }

  delete(uid: string) {
    this.ingresoEgresoService.deleteIngresoEgreso(uid)
        .then( () => Swal.fire(
           'Borrado',
           'Item borrado',
           'success'
        ))
        .catch( err => Swal.fire(
          'Error',
          err.message,
          'error'
       ));
  }

}
