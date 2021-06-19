import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-playlist',
  templateUrl: './view-playlist.component.html',
  styleUrls: ['./view-playlist.component.scss']
})
export class ViewPlaylistComponent implements OnInit {
  @Input() songsList = {};
  playList: Array<any> = [];
  selectedPlaylist = {};
  showPlaylist = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    if (localStorage.getItem('PLAYLIST')) {
      this.playList = JSON.parse(localStorage.getItem('PLAYLIST'));
    }
  }

  // To create a new playlist
  createPlaylist() {
    const dialogRef = this.dialog.open(CreatePlaylistDialog, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      const playlistLength = this.playList.length;
      this.playList.push({ id: playlistLength + 1, name: result });
      localStorage.setItem('PLAYLIST', JSON.stringify(this.playList));
    });
  }

  // To select the clicked playlist
  playListClick(obj) {
    this.showPlaylist = false;
    this.selectedPlaylist = obj;
  }

  // To add new songs to the playlist
  addSongs() {
    const dialogRef = this.dialog.open(SongsListDialog, {
      width: '500px',
      data: this.songsList,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        this.selectedPlaylist['songs'] = result;
        this.updateLocalStorage(result);
      }
    });
  }

  // To shuffle songs in the playlist
  shuffleSongs() {
    this.selectedPlaylist['songs'] = this.selectedPlaylist['songs'].sort(() => Math.random() - 0.5);
    this.updateLocalStorage(this.selectedPlaylist['songs']);
  }

  // To delete songs in the playlist
  deleteSongsInPlaylist(index) {
    this.selectedPlaylist['songs'].splice(index, 1);
    this.updateLocalStorage(this.selectedPlaylist['songs']);
  }

  // To update the local storage value
  updateLocalStorage(data) {
    const index = this.playList.findIndex(obj => obj.id === this.selectedPlaylist['id']);
    if (~index) {
      this.playList[index]['songs'] = data;
      localStorage.setItem('PLAYLIST', JSON.stringify(this.playList));
    }
  }
}

@Component({
  selector: 'create-playlist',
  template: `
  <h1 mat-dialog-title>Create playlist</h1>
  <div mat-dialog-content>
    <mat-form-field style="width: 100%">
      <input matInput autocomplete="off" [(ngModel)]="data">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close (click)="closeDialog()">Create</button>
  </div>`,
})
export class CreatePlaylistDialog {

  constructor(public dialogRef: MatDialogRef<CreatePlaylistDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog() {
    this.dialogRef.close(this.data);
  }

}

@Component({
  selector: 'songs-list-dialog',
  template: `
  <h1 mat-dialog-title>Add songs</h1>
  <div mat-dialog-content style="height: 400px;">
    <mat-form-field style="width: 100%">
        <input matInput autocomplete="off" placeholder="Search songs" (ngModelChange)="filterSongs($event)"
            [(ngModel)]="searchSongs">
    </mat-form-field>

    <mat-action-list>
        <button class="list-option" mat-list-item *ngFor="let song of filteredSongsList">
            <div style="width: 90%">{{song.title}}</div>
            <div style="width: 10%">
                <mat-icon (click)="addSongToPlaylist(song)">add</mat-icon>
            </div>
        </button>
    </mat-action-list>
  </div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close (click)="closeDialog()">Close</button>
  </div>`,
})
export class SongsListDialog {
  filteredSongsList: Array<any> = [];
  searchSongs: string;
  playlistSongs = [];

  constructor(public dialogRef: MatDialogRef<SongsListDialog>, @Inject(MAT_DIALOG_DATA) public songsData: any) {
    this.filteredSongsList = this.songsData;
  }

  filterSongs(value) {
    const str = value.toLowerCase();
    this.filteredSongsList = this.songsData.filter((obj) => obj.title.toLowerCase().includes(str));
  }

  addSongToPlaylist(song) {
    this.playlistSongs.push(song);
  }

  closeDialog() {
    this.dialogRef.close(this.playlistSongs);
  }

}