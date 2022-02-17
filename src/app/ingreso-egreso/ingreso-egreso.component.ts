import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../model/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as uiActions from '../shared/ui.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit {

  type: string = 'ingreso';
  ingresoForm: FormGroup;
  isLoading: boolean = false;
  uiSubscrition?: Subscription;

  constructor( private fb: FormBuilder,
               private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService  ) {
    this.ingresoForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.uiSubscrition = this.store
      .select('ui')
      .subscribe( ui => this.isLoading = ui.isLoading) ;
  }

  ngOnDestroy(): void {
    this.uiSubscrition?.unsubscribe();
  }

  save() {
 
    if ( this.ingresoForm.valid ) {

      this.store.dispatch(  uiActions.isLoading() );

      const { description, amount } = 
          this.ingresoForm.value;

      const ingresoEgreso = new IngresoEgreso
        ( description, amount, this.type );

      this.ingresoEgresoService
        .createIngresoEgreso( ingresoEgreso )
        .then( ( ref ) =>  {
          this.ingresoForm.reset();
          this.store.dispatch(  uiActions.stopLoading() );
          Swal.fire( 'Registro creado', description,  'success');
        } )
        .catch( ( error ) => { 
          this.store.dispatch(  uiActions.stopLoading() );
          Swal.fire( 'Error', error.message, 'error', ) } );
    }
  }

}
