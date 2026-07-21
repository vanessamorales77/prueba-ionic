import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular/standalone';
 
@Injectable({
  providedIn: 'root',
})
export class ActionSheet {
  constructor(private actionSheetController: ActionSheetController) {}
 
  async presentDeleteConfirm(itemName: string, onDelete: () => void, header: string = 'Eliminar') {
    const actionSheet = await this.actionSheetController.create({
      header: header,
      subHeader: `¿Deseas eliminar "${itemName}"?`,
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => {
            onDelete();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close-outline',
        },
      ],
    });
 
    await actionSheet.present();
  }
 
  async presentInfo(header: string, message: string) {
    const actionSheet = await this.actionSheetController.create({
      header: header,
      subHeader: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          icon: 'checkmark-outline',
        },
      ],
    });
 
    await actionSheet.present();
  }
}