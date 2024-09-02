import { Component, Input, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlaceSearchResult } from '../map/place-autocomplete/place-autocomplete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudOpsService } from 'src/app/services/crud-ops.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent {
  constructor(private service : CrudOpsService,private route: ActivatedRoute, private router: Router,) { }

  logForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(20)]),
    lastName: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required,Validators.email]),
    fromData: new FormControl('',[Validators.required]),
    toData: new FormControl('',[Validators.required]),
  });

  // Auto complete variables
  @ViewChild('fromInputField') fromInputField!: ElementRef;
  @ViewChild('toInputField') toInputField!: ElementRef;
  @Input() placeholder: string = '';
  userNameFrom: string = '';
  picURL: string = '';
  fromAutocomplete: google.maps.places.Autocomplete | undefined;
  toAutocomplete: google.maps.places.Autocomplete | undefined;
  google: any;
  fromData: PlaceSearchResult | undefined;
  toData: PlaceSearchResult | undefined;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const data = {
        email: params['emailFromLogin'],
        userName: params['username'],
        picUrl: params['pic'],
      }
      
      if (data) {
       /*  console.log(
          'Email on Login:', data.email,
          '\n User Name captured On log in: ', data.userName,
          '\n Picture captured on log in: ', data.picUrl
        ); */  
        // Set the initial values of the form controls
        this.logForm.patchValue({
          email: data.email,
        });
        this.picURL = data.picUrl
        this.userNameFrom = data.userName
      }
    });
  } 
  
  onSubmit(form:any){
      var data = {
        firstName:form.firstName,
        lastName:form.lastName,
        firstLogin: false, // Add the firstLogin flag here
        /* username:this.userNameFrom,
        email:form.email,
        photo:this.picURL, */
      }
      var location = {
        fromData:form.fromData,
        toData:form.toData,
        date:new Date().toDateString(),
        time: new Date().toLocaleTimeString(),
        author:form.email,
      }
      // Check if the user with the provided email exists
      this.service.checkUserByEmail(form.email).subscribe((exists: boolean) => {
        if (exists) {
          // If the user exists, get the document ID associated with the email
          this.service.getUserIdByEmail(form.email).subscribe((userId: string | undefined) => {
            if (userId) {
              // If the document ID is retrieved, update the user's document
              this.service.updateUser(data, userId)
                .then(() => {
                  console.log('User document updated successfully');
                  // this.router.navigate(['/dashboard']);
                })
                .catch((error) => {
                  console.error('Error updating user document:', error);
                });
                // console.log("Form User Data:", data) 
                this.service.createTrip(location)
                .then((result) => {
                // console.log('Document created with ID:', result.id,'\n Trip data:',result);
                this.router.navigate(['/dashboard'])
                return result
              })
              .catch((error) => {
                console.error('Error creating document:', error);
              });
            // console.log("Form Location Data:", location)
            } else {
              console.error('Document ID not found for the user with email:', form.email);
            }
          });
        } else {
          console.error('User with email', form.email, 'does not exist');
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
    const result: any = {
      address: inputValue,
      location: {
        lat: place?.geometry?.location?.lat()||0,
        lng: place?.geometry?.location?.lng()||0,
      }
    };
    // Log details to console
    console.log(`Location (Lat, Long) for ${dataField}: ${result.location?.lat}, ${result.location?.lng}`);
    // Update logForm values based on dataField
    if (dataField === 'fromData') {
      this.logForm.patchValue({
        fromData: {
          address: result.address,
          iconUrl:place?.icon,
          imgUrl: this.getImgUrl(place),
          location: result.location, // Flatten the structure
        },
      });
    } else if (dataField === 'toData') {
      this.logForm.patchValue({
        toData: {
          address: result.address,
          iconUrl:place?.icon,
          imgUrl: this.getImgUrl(place),
          location: result.location, // Flatten the structure
        },
      });
    }
  }
  
  getImgUrl(place: google.maps.places.PlaceResult | undefined): string | undefined {
    return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxHeight: 250, maxWidth: 500 }) : undefined;
  }
  
  hasError(controlName: string, errorType: string): boolean {
    const control = this.logForm.get(controlName);
    return control ? control.hasError(errorType) && (control.touched || control.dirty) : false;
  }

  clearInput(inputField: 'fromInputField' | 'toInputField'): void {
    (this[inputField].nativeElement as HTMLInputElement).value = '';
    this[inputField === 'fromInputField' ? 'fromData' : 'toData'] = undefined;

    // Log details to console
    console.log(`Input field ${inputField} cleared. ${inputField === 'fromInputField' ? 'FromData' : 'ToData'} set to undefined.`);
  }
}
