import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';  //
import { Observable, from, map } from 'rxjs';
import { User as FirebaseAuthUser, UserInfo } from '@firebase/auth/dist/auth-public';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private asf: AngularFireAuth) { }

  logIn(email: string, password: string) {
    return from(this.asf.signInWithEmailAndPassword(email, password));
  }

  logOut() {
    return from(this.asf.signOut());
  }

  // Login Services
  signInWithGoogle(){
    return this.asf.signInWithPopup(new GoogleAuthProvider())
  }

  signInWithEmailAndPassword(user:{email:string,password:string}){
    return from(this.asf.signInWithEmailAndPassword(user.email,user.password))
  }

  currentUser$: Observable<FirebaseAuthUser | null> = this.asf.authState.pipe(
    map(user => user as FirebaseAuthUser | null)
  );
  
  // Additional observable to track if it's the user's first login
  isFirstLogin$: Observable<boolean> = this.currentUser$.pipe(
    map(user => {
      // Perform any logic to determine if it's the first login
      return user?.metadata?.creationTime === user?.metadata?.lastSignInTime;
    })
  );
}
