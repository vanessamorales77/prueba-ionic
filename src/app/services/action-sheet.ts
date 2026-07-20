import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ActionSheet {
  constructor(private actionSheetController: ActionSheetController) {}

  async presentDeleteConfirm(taskName: string, onDelete: () => void) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Eliminar tarea',
      subHeader: `¿Deseas eliminar "${taskName}"?`,
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
          text: 'OK',
          role: 'cancel',
          icon: 'checkmark-outline',
        },
      ],
    });

    await actionSheet.present();
  }
}
