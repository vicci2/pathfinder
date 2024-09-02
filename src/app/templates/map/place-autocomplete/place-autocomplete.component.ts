import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlaceDetailsComponent } from '../place-details/place-details.component';
import { MapDisplayComponent } from '../map-display/map-display.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CrudOpsService } from 'src/app/services/crud-ops.service';
import { Router } from '@angular/router';

export interface PlaceSearchResult {
  address: string;
  name?: string;
  location?: google.maps.LatLng;
  imgUrl?: string;
  iconUrl?: string;
}

@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule,  PlaceDetailsComponent, MapDisplayComponent ,GoogleMapsModule, FormsModule,ReactiveFormsModule, MatButtonModule, MatIconModule, MatMenuModule, ],
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css']
})
export class PlaceAutocompleteComponent implements OnInit {
  
  constructor(private ngZone: NgZone, private authService:AuthenticationService,private crudOps:CrudOpsService,private router: Router,) { }    

  fromAutocomplete: google.maps.places.Autocomplete | undefined;
  toAutocomplete: google.maps.places.Autocomplete | undefined;
  google: any;
  fromData: PlaceSearchResult | undefined;
  toData: PlaceSearchResult | undefined;
  userEmail: string|undefined;
  
  @ViewChild('fromInputField') fromInputField!: ElementRef;
  @ViewChild('toInputField') toInputField!: ElementRef;
  @Input() placeholder: string = '';

  tripForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    fromData: new FormControl('',[Validators.required]),
    toData: new FormControl('',[Validators.required]),
  });

  ngOnInit(): void {
    // Get the current user's email and set it to the tripForm
    this.currentUser.subscribe(user => {
     if (user && user.email) {
       this.userEmail = user.email;
       this.tripForm.patchValue({
         email: this.userEmail
        });
        // console.log(`Current User is ${this.userEmail}`)
     }
   });
  }

  ngAfterViewInit() {
    this.fromAutocomplete = new google.maps.places.Autocomplete(this.fromInputField.nativeElement);
    this.toAutocomplete = new google.maps.places.Autocomplete(this.toInputField.nativeElement);

    this.fromAutocomplete.addListener('place_changed', () => {
      const inputValue = this.fromInputField.nativeElement.value;
      const place = this.fromAutocomplete?.getPlace();
      this.handlePlaceChanged(inputValue, place, 'fromData');
      
      // Log details to console
      /* console.log('FromData:', this.fromData); */
    });

    this.toAutocomplete.addListener('place_changed', () => {
      const inputValue = this.toInputField.nativeElement.value;
      const place = this.toAutocomplete?.getPlace();
      this.handlePlaceChanged(inputValue, place, 'toData');
      
      // Log details to console
      /* console.log('ToData:', this.toData); */
    });
  }

  handlePlaceChanged(inputValue: string, place: google.maps.places.PlaceResult | undefined, dataField: 'fromData' | 'toData') {
    const result: PlaceSearchResult = {
      address: inputValue,
      name: place?.name,
      location: place?.geometry?.location,
      imgUrl: this.getImgUrl(place),
      iconUrl: place?.icon,
    };

     // Update logForm values based on dataField
     if (dataField === 'fromData') {
      this.tripForm.patchValue({
        fromData: {
          address: inputValue,
          iconUrl:place?.icon,
          imgUrl: this.getImgUrl(place),
          location: {
        lat: place?.geometry?.location?.lat()||0,
        lng: place?.geometry?.location?.lng()||0,
      }
        },
      });
    } else if (dataField === 'toData') {
      this.tripForm.patchValue({
        toData: {
          address: inputValue,
          iconUrl:place?.icon,
          imgUrl: this.getImgUrl(place),
          location: {
        lat: place?.geometry?.location?.lat()||0,
        lng: place?.geometry?.location?.lng()||0,
      }
        },
      });
    }
    this.ngZone.run(() => {
      this[dataField] = result;
    });

    console.log(`Location (Lat, Long) for ${dataField}: ${result.location?.lat()}, ${result.location?.lng()}`);
    console.log(`Place changed in ${dataField}:`, result);
    // Log details to console
    
  // console.log(`Place changed in ${dataField}:`, result);
  // console.log(`Location Name for ${dataField}: ${result.name}`);
  // console.log(`Address for ${dataField}: ${result.address}`);
  // console.log(`Image URL for ${dataField}: ${result.imgUrl}`);
  // console.log(`Icon URL for ${dataField}: ${result.iconUrl}`);
 
  }

  getImgUrl(place: google.maps.places.PlaceResult | undefined): string | undefined {
    return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxHeight: 250, maxWidth: 500 }) : undefined;
  }

  clearInput(inputField: 'fromInputField' | 'toInputField'): void {
    (this[inputField].nativeElement as HTMLInputElement).value = '';
    this[inputField === 'fromInputField' ? 'fromData' : 'toData'] = undefined;

    // Log details to console
    // console.log(`Input field ${inputField} cleared. ${inputField === 'fromInputField' ? 'FromData' : 'ToData'} set to undefined.`);
  }

  onSubmit(form : any) {
    const data = {
      fromData: form.fromData,
      toData: form.toData,
      author: this.userEmail,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString(),
    };
    try {
      if (this.tripForm.valid) {
        if (this.userEmail) {
          this.crudOps.checkUserByEmail(this.userEmail).subscribe(userExists => {
            if (userExists) {
              // console.log('User with the given email exists.');
              // console.log(`from data ${this.fromData} to data: `)
              

              // Additional logic & navigation
              // console.log(`Data ${form.fromData}`)
              this.crudOps.createTrip(data)
               .then((result) => {
                this.router.navigate(['/dashboard'])
                console.log(`Document created with ID ${result.id},\n Trip data:', ${result}`);
                alert('Trip created successfully!');
              })
              .catch((error) => {
                console.error('Error creating document:', error);
                alert('Error creating trip. Please try again.');
              });
            } else {
              console.log('User with the given email does not exist.');
            }
          });
        } else {
          console.log('No user or email found.');
        }
      } else {
        alert('Please fill in both "FROM" and "DESTINATION" fields.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  }

  get currentUser() {
    return this.authService.currentUser$;
  }
}

