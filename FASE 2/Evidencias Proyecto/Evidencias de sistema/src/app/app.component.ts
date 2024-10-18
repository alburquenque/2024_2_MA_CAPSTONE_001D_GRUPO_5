import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.addAllIcons();
  }

  addAllIcons(){
      addIcons({
      closeOutline
    });
    };
}
