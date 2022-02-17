import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre?: string;
  authSubscription?: Subscription;

  constructor( private authService: AuthService,
               private store:Store<AppState>,
               private router: Router ) { }
 

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
        .pipe( 
          filter(({ user }) => user != null)
        )
        .subscribe( ({ user }) => {
      this.nombre = user!.name;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  logout() {
    this.authService.logout()
    .then((result) => {
      this.router.navigate(['/login']);
    });
  }

}
