import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router, ) {
    this.loginForm = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required ]],
    });
  }

  ngOnInit(): void {
  }

  login() {
    if( this.loginForm.valid ) {


      Swal.fire({
        title: 'Please wait...', 
        didOpen: () => {
          Swal.showLoading()  
        }, 
      });


      const{ email, password } = this.loginForm.value;
      this.authService.login( email, password  )
      .then( ( credentials ) => {
        console.log( credentials );
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch((error) => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message, 
      }));
    }
  }

}
