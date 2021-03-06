import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { map } from 'rxjs/operators';
import { User } from '../model/user.mode';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription?: Subscription;
  private _user?: User | null;

  get user() {
    return { ...this._user };
  }
    
  constructor( public auth: AngularFireAuth,
               private store: Store<AppState>,
               private angularFirestore: AngularFirestore) {}

               
  initAuthListener() {
    this.auth.authState.subscribe( (fuser) => {
      if (fuser) {
        this.userSubscription = this.angularFirestore.doc(`${ fuser.uid }/usuario`).valueChanges()
            .subscribe( firestoreUser => { 
              this._user = User.fromFirestore( firestoreUser );
              
              this.store.dispatch( authActions.setUser({ 
                user: this._user
              }));
 
            }); 
      } else {
        this._user = null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch( authActions.unSetUser() ); 
        this.store.dispatch( ingresosEgresosActions.unSetItems() ); 
      }
    });
  }

  createUser(name: string, email:string, password:string) {
    return this.auth.createUserWithEmailAndPassword( email, password )
      .then( ({ user }) => {

        const newUser = new User(
             user!.uid,
             name,
             email
        );

        return this.angularFirestore.doc(`${ user!.uid }/usuario`)
            .set( {...newUser} );
    
      });
  }

  login( email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }
  
  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fuser  => fuser != null )
    );
  }

}
