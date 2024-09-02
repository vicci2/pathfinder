import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSearchResult } from '../place-autocomplete/place-autocomplete.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [CommonModule,MatCardModule,],
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.css']
})
export class PlaceDetailsComponent {

  constructor(){}

  @Input() data:PlaceSearchResult | undefined;
/*  @Input() data:PlaceSearchResult ={
    
 address : "White House, Pennsylvania Avenue Northwest, Washington, DC, USA",
iconUrl : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/civic_building-71.png",
imgUrl : "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFjb-yzAJyiRxe18sshoYYMaCegKI6oQc2lzSRWpxYbRRQCxS9wvSkhX5nXs2xRHao64ziYKR6_YIBdmQthvlSkGMIfmxCnQhXPjzQATnLSbH2vPhrfvOcNmxXgdxqzpcy3ae6sKnj0gr8uWc_a_bX5PMTmVrYFzvGOm6gg7i5mtpGcD&3u500&4u250&5m1&2e1&callback=none&key=AIzaSyDlkX43cE8bvl8n_cWyvo4Ea4K-b1hLlHQ&token=546",
// location : _.Lj {lat: ƒ, lng: ƒ},
name : "The White House"

  }; */
}
