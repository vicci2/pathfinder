import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSearchResult } from '../place-autocomplete/place-autocomplete.component';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs';

@Component({
  selector: 'app-map-display',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule], // GoogleMapsModule should be imported in the module where this component is declared
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit, OnChanges {

  @ViewChild('map',{static:true}) map!:GoogleMap
  @Input() from: PlaceSearchResult | undefined;
  @Input() to: PlaceSearchResult | undefined;

  zoom = 5;
  directionResult: google.maps.DirectionsResult | undefined;
  markerPosition:google.maps.LatLng | undefined;

  constructor(private directionService: MapDirectionsService) {}

  ngOnChanges() {
    const fromLoc = this.from?.location;
    const toLoc = this.to?.location;
    
    // When there are valid locations, you can call the getDirection function
    if (fromLoc && toLoc) {
      this.getDirection(fromLoc, toLoc);      
    }else if(toLoc){
      this.goToLoc(toLoc)   
    }
    else if(fromLoc){
      this.goToLoc(fromLoc)
    }
  }

  getDirection(from: google.maps.LatLng, to: google.maps.LatLng) {
    const request: google.maps.DirectionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionService.route(request).pipe(
      map(res => res.result)
    ).subscribe((result) => {
      this.directionResult = result;
      this.markerPosition = undefined;      
    });
  }
  goToLoc(location:google.maps.LatLng){
    this.markerPosition = location;
    this.map.panTo(location);
    this.zoom = 17;
    this.directionResult = undefined;
  }
  ngOnInit(): void {
    // Initialization logic, if needed
  }
}
