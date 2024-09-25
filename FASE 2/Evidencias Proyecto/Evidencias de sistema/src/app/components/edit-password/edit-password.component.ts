import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent  implements OnInit {

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
