import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CrudOpsService } from 'src/app/services/crud-ops.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  hide: boolean = true;
  registerForm: FormGroup;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private crudOps: CrudOpsService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]], // Only require confirmation
    }, {
      validators: this.passwordValidator
    });
  }

  passwordValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.hasError(errorType) && (control.touched || control.dirty) : false;
  }

  resetForm() {
    this.registerForm.reset();
  }

  async registerFunc() {
    try {
      const { email, password } = this.registerForm.value;

      const userExists = await this.crudOps.checkUserByEmail(email).toPromise();

      if (userExists) {
        console.log(`User with email ${email} already exists.`);
        // Notify the user that registration is not possible
        // Implement user notification here
      } else {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const userData = {
          firstName: '',
          lastName: '',
          username: '',
          email: email,
          photo: '',
          firstLogin: true,
          date: new Date().toDateString(),
          time: new Date().toLocaleDateString()
        };

        // const result = await this.crudOps.createUser(userData).toPromise();
        const result = this.crudOps.createUser(userData);

        console.log('User added to Firestore successfully.');
        // Redirect to the login page
        this.router.navigateByUrl('/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Implement user notification for registration error
    }
  }

  async registerWithGoogle() {
    try {
      const userCredential = await this.authService.signInWithGoogle();
      const user = userCredential.user;

      if (user && user.email) {
        const userExists = await this.crudOps.checkUserByEmail(user.email).toPromise();

        if (userExists) {
          // User with the given email exists
          console.log(`User with email ${user.email} already exists`);
          // Navigate to registration page
          this.router.navigate(['/register']);
          // Implement user notification here
        } else {
          // User with the given email does not exist
          // Create user document
          const userData = {
            firstName: '',
            lastName: '',
            username: user.displayName,
            email: user.email,
            photo: user.photoURL,
            firstLogin: true,
            date: new Date().toDateString(),
            time: new Date().toLocaleTimeString(),
          };

          // await this.crudOps.createUser(userData).toPromise();
          const result = this.crudOps.createUser(userData);
          // console.log('User document created successfully.');
          // Navigate to login page
          this.router.navigate(['/login']);
        }
      } else {
        console.error('User object or email is null');
        // Implement user notification for null email
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Implement user notification for Google registration error
    }
  }

  async forgotPassword() {
    try {
      const email = prompt('Enter your email to reset password:');

      if (email) {
        await this.afAuth.sendPasswordResetEmail(email);
        alert('Password reset email sent. Check your inbox.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      // Implement user notification for forgot password error
    }
  }
}
