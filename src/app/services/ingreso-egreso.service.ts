import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../model/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(  private angularFirestore: AngularFirestore,
                private authService: AuthService ) { }

  createIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
    const uid = this.authService.user.uid;
    return this.angularFirestore.doc(`${ uid }/ingresos-egresos`)
        .collection('items')
        .add({ 
              description: ingresoEgreso.description,
              amount: ingresoEgreso.amount,
              type: ingresoEgreso.type
            }); 
  }

  initIngresosEgresosListener( uid: string ) {

    return this.angularFirestore.collection(`${ uid }/ingresos-egresos/items`)
        .snapshotChanges()
        .pipe(
          map( snapshot => { 
            return snapshot.map( doc => ({
                uid: doc.payload.doc.id,
                ...doc.payload.doc.data() as any
              })
            )
          })
        );
  }

  deleteIngresoEgreso( uidItem: string) {
    const uid = this.authService.user.uid;
    return this.angularFirestore
               .doc(`${ uid }/ingresos-egresos/items/${ uidItem }`)
               .delete();
  }

}
