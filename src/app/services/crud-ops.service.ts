import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudOpsService {

  constructor(private firestore: AngularFirestore) { }

  /* User Methods */

  // Create a new document in the collection
  createUser(data: any): Promise<any> {
    return this.firestore.collection('userdetails').add(data);
  }
  // Create a new document in the "trip" collection
  createTrip(data: any): Promise<any> {
    return this.firestore.collection('trip').add(data);
  }
  
  // Get all documents from a collection
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('userdetails').valueChanges({ idField: 'id' });
  }
    
  getAllTrips(): Observable<any[]> {
    return this.firestore.collection('trip').valueChanges({ idField: 'id' });
  }
    
  // Get a specific user document from a collection
  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('userdetails').doc(userId).valueChanges();
  }

  // Update a document in the collection
  updateUser(data: any, userId: string): Promise<void> {
    return this.firestore.collection('userdetails').doc(userId).update(data);
  }

  // Delete a document from the collection
  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('userdetails').doc(userId).delete();
  }
  // Update a document in the collection
  /* updateTrip(data: any, userId: string): Promise<void> {
    return this.firestore.collection('trip').doc(userId).update(data);
  } */

  // Delete a document from the collection
  deleteTrip(userId: string): Promise<void> {
    return this.firestore.collection('trip').doc(userId).delete();
  }

  // Check if a user with the given email exists
  checkUserByEmail(email: string): Observable<boolean> {
    return this.firestore
      .collection('userdetails', (ref) => ref.where('email', '==', email))
      .get()
      .pipe(
        map((querySnapshot) => querySnapshot.docs.length > 0),
        catchError((error) => {
          console.error('Error checking user by email:', error);
          return of(false);
        })
      );
  }
  
  // Check if a user with the given username exists
  checkUserByUsername(username: string): Observable<boolean> {
    return this.firestore.collection('userdetails', ref => ref.where('username', '==', username))
      .get()
      .pipe(
        map(querySnapshot => querySnapshot.size > 0),
        catchError(error => {
          console.error('Error checking user by username:', error);
          return of(false);
        })
      );
  }

  // Get user ID by email
  getUserIdByEmail(email: string): Observable<string | undefined> {
    return this.firestore.collection('userdetails', ref => ref.where('email', '==', email))
      .get()
      .pipe(
        map(querySnapshot => {
          const user = querySnapshot.docs[0];
          return user ? user.id : undefined;
        }),
        catchError(error => {
          console.error('Error getting user ID by email:', error);
          return of(undefined);
        })
      );
  }

  // Check if it's the user's first login
  checkFirstLogin(email: string): Observable<boolean> {
    return this.firestore.collection('userdetails').doc(email)
      .valueChanges()
      .pipe(
        map((userData: any) => !userData || userData.firstLogin !== false)
      );
  }

}
