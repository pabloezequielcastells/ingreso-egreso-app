import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  
  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router, ) { 
    this.registerForm = this.fb.group({
      nombre: [ '', Validators.required ],
      correo: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ],
    });
  }

  ngOnInit(): void {
   
  }

  createUser() {
    if ( this.registerForm.valid ) {

      Swal.fire({
        title: 'Please wait...', 
        didOpen: () => {
          Swal.showLoading()  
        }, 
      });


      const { nombre, correo, password } = this.registerForm.value;
      this.authService.createUser(nombre, correo, password)
        .then((credential) => {
          console.log(credential);
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
