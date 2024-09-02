import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CrudOpsService } from 'src/app/services/crud-ops.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  mail: boolean = true;

  logForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    passWord: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthenticationService, private router: Router, private crudOps: CrudOpsService, private afAuth: AngularFireAuth) {
    if (!this.mail) {
      this.logForm.get('userName')?.setValidators([Validators.required, Validators.email]);
      this.logForm.get('userName')?.updateValueAndValidity();
    }
  }

  ngOnInit() {}

  changeLogintype() {
    this.mail = !this.mail;
    if (!this.mail) {
      this.logForm.get('userName')?.setValidators([Validators.required, Validators.email]);
    } else {
      this.logForm.get('userName')?.setValidators([Validators.required]);
    }
    this.logForm.get('userName')?.updateValueAndValidity();
  }

  resetForm() {
    this.logForm.reset();
  }

  loginFunc() {
    if (this.logForm.invalid) {
      console.error('Login form is invalid.');
      return;
    }

    const { userName, passWord } = this.logForm.value;
    const checkUserObservable = this.mail
      ? this.crudOps.checkUserByUsername(userName)
      : this.crudOps.checkUserByEmail(userName);

    checkUserObservable.subscribe((exists: boolean) => {
      if (exists) {
        this.handleUserExists(userName, passWord);
      } else {
        console.log(`User with ${userName} doesn't exist`);
        this.router.navigate(['/login']);
      }
    });
  }

  private handleUserExists(userName: string, passWord: string) {
    this.authService.signInWithEmailAndPassword({ email: userName, password: passWord })
      .subscribe(() => {
        this.authService.isFirstLogin$.subscribe(isFirstLogin => {
          if (isFirstLogin) {
            this.router.navigate(['/firstLogin'], {
              queryParams: { emailFromLogin: userName }
            });
          } else {
            this.router.navigate(['/dashboard']);
          }
        });
      });
  }

  async loginWithGoogle() {
    try {
      const userCredential = await this.authService.signInWithGoogle();
      const user = userCredential.user;
      if (user) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;

        if (email) {
          this.crudOps.checkUserByEmail(email).subscribe((exists: boolean) => {
            if (exists) {
              this.handleLogin(email, displayName, photoURL);
            } else {
              console.log(`User with email ${email} doesn't exist`);
              this.router.navigate(['/']);
            }
          });
        } else {
          console.error('User email is null');
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  private handleLogin(email: string, displayName: string | null, photoURL: string | null) {
    this.authService.isFirstLogin$.subscribe(isFirstLogin => {
      if (isFirstLogin) {
        this.router.navigate(['/firstLogin'], {
          queryParams: {
            emailFromLogin: email,
            username: displayName || '',
            pic: photoURL || '',
          }
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.logForm.get(controlName);
    return control ? control.hasError(errorType) && (control.touched || control.dirty) : false;
  }
  
  async forgotPassword() {
    try {
      const email = prompt('Enter your email to reset password:');  
       if (email) {
        const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
        if (methods && methods.length > 0) {
          this.router.navigateByUrl(`/reset-options/${email}`);
        } else {
          alert('Invalid email address. Please try again.');
          this.router.navigateByUrl('/login');
        }
      } 
    } catch (error) {
      console.error(error);
    }
  }
}
