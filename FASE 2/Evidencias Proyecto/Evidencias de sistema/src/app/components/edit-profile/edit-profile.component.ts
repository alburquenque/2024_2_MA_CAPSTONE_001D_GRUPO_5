import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit{
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
  
  name=String;
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  
  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

}

