import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var google: any; // Declare the 'google' variable to avoid TypeScript errors

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('toInputField') toInputField!: ElementRef;
  directionsService: any;
  directionsRenderer: any;
  haight: any;

  ngOnInit() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.haight = new google.maps.LatLng(37.7699298, -122.4469157);

    this.initMap();
  }

  initMap() {
    const mapOptions = {
      zoom: 14,
      center: this.haight
    };

    const map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.directionsRenderer.setMap(map);

    const request = {
      origin: 'San Francisco, CA',
      destination: 'Mountain View, CA',
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status == 'OK') {
        this.directionsRenderer.setDirections(result);
      }
    });
  }
}
