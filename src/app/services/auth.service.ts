import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@firebase/firestore';
import { map } from 'rxjs/operators';
import { User } from '../model/user.mode';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private angularFirestore: AngularFirestore) {}

               
  initAuthListener() {
    this.auth.authState.subscribe( (fuser) => {
      console.log(fuser);
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
