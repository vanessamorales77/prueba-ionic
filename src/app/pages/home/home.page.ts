import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonList, IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { ActionSheet } from 'src/app/services/action-sheet';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonIcon,
    IonList,
    IonCheckbox,
    FormsModule
  ],
})
export class HomePage {
  public tasks: Task[] = [];
  public newTask: string = '';

  constructor(private actionSheetService: ActionSheet) {
    addIcons({
      addOutline,
      trashOutline,
      closeOutline,
      checkmarkOutline
    });
  }

  addTask(){
    if(!this.existsTask(this.newTask)){
      this.tasks.push({
        id: crypto.randomUUID(),
        name: this.newTask,
        completed: false
      });
      this.newTask = '';
    } else {
      this.actionSheetService.presentInfo('¡Tarea ya existe!', 'La tarea ya existe en la lista');
    }
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(task: Task) {
    this.actionSheetService.presentDeleteConfirm(task.name, () => {
      this.tasks = this.tasks.filter((item: Task) => item.id !== task.id);
    });
  }

  private existsTask(name: string) {
    return this.tasks.find((item: Task) => item.name.toLowerCase().trim() === name.toLowerCase().trim());
  }
}
