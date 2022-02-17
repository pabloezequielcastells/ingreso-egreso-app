import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  authSubscription?: Subscription;
  ingresosEgresosSubscription?: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }


  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.ingresosEgresosSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null )
        ).subscribe( auth => {
          console.log('usuario ' + auth.user!.uid);
          this.ingresosEgresosSubscription = this.ingresoEgresoService
              .initIngresosEgresosListener( auth.user!.uid )
              .subscribe( (ingresoEgresoFb) => {
                console.log( ingresoEgresoFb );
                this.store.dispatch( ingresoEgresoActions.setItems({ items: [...ingresoEgresoFb] }) );
              });
        });
  }

}
