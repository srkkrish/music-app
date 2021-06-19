import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  filteredSongsList: Array<any> = [];
  songsList: Array<any> = [];
  showSpinner: boolean;
  searchSongs: string;

  constructor(private http: HttpClient, public dialog: MatDialog,
    public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('SONGS_LIST')) {
      this.songsList = JSON.parse(localStorage.getItem('SONGS_LIST'));
      this.filteredSongsList = this.songsList;
    } else {
      this.fetchSongs();
    }
  }

  fetchSongs() {
    this.showSpinner = true;
    const url = 'https://jsonplaceholder.typicode.com/photos';
    this.http.get(url).subscribe({
      next: (response: any) => {
        this.showSpinner = false;
        this.songsList = response;
        this.filteredSongsList = response;
        localStorage.setItem('SONGS_LIST', JSON.stringify(this.songsList));
      }, error: () => {
        this.showSpinner = false;
      }
    })
  }

  // To filter the playlist
  filterSongs(value) {
    const str = value.toLowerCase();
    this.filteredSongsList = this.songsList.filter((obj) => obj.title.toLowerCase().includes(str));
  }
}