import { Component, OnInit, ViewChild } from '@angular/core';
import { Dashboard } from 'src/app/interface/dashboard';
import { FormControl } from '@angular/forms';
import { CrudOpsService } from 'src/app/services/crud-ops.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private appgetService: CrudOpsService,public authService:AuthenticationService) {}

  // Variables
  cards: Dashboard[] = [];
  sortingControl = new FormControl('');

  // MatTableDataSource for sorting and pagination
  dataSource: MatTableDataSource<Dashboard> = new MatTableDataSource();
  
  // ViewChild for MatSort and MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.appgetService.getAllTrips().subscribe((response) => {
      this.cards = response;
      this.dataSource = new MatTableDataSource(this.cards);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

// Update and Delete actions using CrudOpsService
/* updateAction(item: any) {
  // Call the update method in CrudOpsService
  // this.appgetService.updateTrip(item.id, updatedData).then(() => {
  this.appgetService.updateTrip(item.id).then(() => {
    console.log('Update successful:', item);
    this.get(); // Refresh the data after update
  }).catch((error) => {
    console.error('Error updating item:', error);
  });
} */

deleteAction(item: any) {
  // Call the delete method in CrudOpsService
  this.appgetService.deleteTrip(item.id).then(() => {
    console.log('Delete successful:', item);
    this.get(); // Refresh the data after delete
  }).catch((error) => {
    console.error('Error deleting item:', error);
  });
}
  // sorting control (remain unchanged)
}
