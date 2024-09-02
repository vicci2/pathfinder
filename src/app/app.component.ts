import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, ViewChild } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pathfinder';
  @ViewChild('drawer') drawer!: MatSidenav;  // Reference to the drawer

  constructor(public authService: AuthenticationService, private router: Router) { }

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
      );

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  logOut() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  menuAction(action: string) {
    // Handle menu actions here
    console.log(`Menu Action: ${action}`);
    this.menuOpen = false; // Close the menu after an action
  }


}
