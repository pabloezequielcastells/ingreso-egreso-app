import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  loading = false;
  subscriptions?: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private store: Store<AppState>,
               private router: Router, ) {
    this.loginForm = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required ]],
    });
  }

  ngOnInit(): void {

    this.subscriptions = this.store.select('ui').subscribe( ui => {
                                this.loading = ui.isLoading;
                                console.log('cargando sub');
                              }); 
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  login() {
    if( this.loginForm.valid ) {

      this.store.dispatch( ui.isLoading() ); 
      
      const{ email, password } = this.loginForm.value;
      this.authService.login( email, password  )
      .then( ( credentials ) => {
        console.log( credentials ); 
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
