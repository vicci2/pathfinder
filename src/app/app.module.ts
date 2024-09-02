import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* App Components */
import { RegisterComponent } from './auths/components/register/register.component';
import { LoginComponent } from './auths/components/login/login.component';
import { DashboardComponent } from './templates/dashboard/dashboard.component';
import { FirstLoginComponent } from './templates/first-login/first-login.component';
import { ResetOpsComponent } from './auths/components/reset-ops/reset-ops.component';
import { MapComponent } from './templates/map/map/map.component';
import { TripComponent } from './templates/map/trip/trip.component';


/* App Modules */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule} from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


/* App firebase */
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { environment } from 'src/environments/environment';

/* App Goole Maps */



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    FirstLoginComponent,
    ResetOpsComponent,
    MapComponent,
    TripComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),    
    AngularFireAuthModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
