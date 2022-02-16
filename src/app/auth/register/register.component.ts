import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  subscriptions?: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private store: Store<AppState>,
               private router: Router, ) { 
    this.registerForm = this.fb.group({
      nombre: [ '', Validators.required ],
      correo: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ],
    });
  }

  ngOnInit(): void {

    this.subscriptions = this.store.select('ui').subscribe( ui => {
                                this.loading = ui.isLoading;
                                console.log('cargando sub');
                              }); 
  }

  createUser() {
    if ( this.registerForm.valid ) {

      this.store.dispatch( ui.isLoading() ); 

      const { nombre, correo, password } = this.registerForm.value;
      this.authService.createUser(nombre, correo, password)
        .then((credential) => {
          console.log(credential);
          this.store.dispatch( ui.stopLoading() ); 
          this.router.navigate(['/']);
        })
        .catch((error) => {
          this.store.dispatch( ui.stopLoading() ); 
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message, 
          })
        });
    }
  }

}
