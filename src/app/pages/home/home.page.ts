import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel,
  IonList,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  trashOutline,
  closeOutline,
  checkmarkOutline,
  createOutline,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import { ActionSheet } from 'src/app/services/action-sheet';
import { Preferences } from '@capacitor/preferences';

import { Task } from 'src/app/models/tasks.model';
import { Category } from 'src/app/models/category.model';
import { RemoteConfigService } from 'src/app/services/remote-config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    IonSelect,
    IonSelectOption,
    FormsModule,
  ],
})
export class HomePage {
  public tasks: Task[] = [];
  public newTask: string = '';
  public selectedCategoryId: string = '';
  private readonly TASKS_KEY = 'tasksKey';

  public categories: Category[] = [];
  public newCategory: string = '';
  public filterCategoryId: string = 'all';
  public editingCategoryId: string | null = null;
  public editingCategoryName: string = '';
  private readonly CATEGORIES_KEY = 'categoriesKey';
  public showCategoryManager: boolean = false;
  public categoriesEnabled: boolean = true;

  constructor(
    private actionSheetService: ActionSheet,
    private remoteConfigService: RemoteConfigService,
    private cdr: ChangeDetectorRef,
  ) {
    addIcons({
      addOutline,
      trashOutline,
      closeOutline,
      checkmarkOutline,
      createOutline,
      chevronDownOutline,
      chevronUpOutline,
    });
  }

  async ionViewWillEnter() {
    await this.remoteConfigService.init();
    this.categoriesEnabled = this.remoteConfigService.isCategoriesEnabled();

    const taskPreferences = await Preferences.get({ key: this.TASKS_KEY });
    if (taskPreferences.value) {
      const tasks = JSON.parse(taskPreferences.value);
      if (Array.isArray(tasks)) {
        this.tasks = tasks;
      }
    }

    const categoryPreferences = await Preferences.get({ key: this.CATEGORIES_KEY });
    if (categoryPreferences.value) {
      const categories = JSON.parse(categoryPreferences.value);
      if (Array.isArray(categories)) {
        this.categories = categories;
      }
    }
    this.cdr.markForCheck();
  }

  toggleCategoryManager() {
    this.showCategoryManager = !this.showCategoryManager;
  }

  get filteredTasks(): Task[] {
    if (this.filterCategoryId === 'all') {
      return this.tasks;
    }
    return this.tasks.filter((task: Task) => task.categoryId === this.filterCategoryId);
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return '';
    return this.categories.find((category: Category) => category.id === categoryId)?.name ?? '';
  }

  addTask() {
    if (!this.existsTask(this.newTask)) {
      this.tasks.push({
        id: crypto.randomUUID(),
        name: this.newTask,
        completed: false,
        categoryId: this.selectedCategoryId || undefined,
      });
      this.newTask = '';
      this.selectedCategoryId = '';
      this.saveTasks();
    } else {
      this.actionSheetService.presentInfo('¡Tarea ya existe!', 'La tarea ya existe en la lista');
    }
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(task: Task) {
    this.actionSheetService.presentDeleteConfirm(
      task.name,
      () => {
        this.tasks = this.tasks.filter((item: Task) => item.id !== task.id);
        this.saveTasks();
        this.cdr.markForCheck();
      },
      'Eliminar tarea',
    );
  }

  private existsTask(name: string) {
    return this.tasks.find(
      (item: Task) => item.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }

  saveTasks() {
    Preferences.set({
      key: this.TASKS_KEY,
      value: JSON.stringify(this.tasks),
    });
  }

  addCategory() {
    if (!this.existsCategory(this.newCategory)) {
      this.categories.push({
        id: crypto.randomUUID(),
        name: this.newCategory,
      });
      this.newCategory = '';
      this.saveCategories();
    } else {
      this.actionSheetService.presentInfo(
        '¡Categoría ya existe!',
        'La categoría ya existe en la lista',
      );
    }
  }

  startEditCategory(category: Category) {
    this.editingCategoryId = category.id;
    this.editingCategoryName = category.name;
  }

  saveEditCategory(category: Category) {
    if (this.editingCategoryName.trim()) {
      category.name = this.editingCategoryName.trim();
      this.saveCategories();
    }
    this.editingCategoryId = null;
  }

  deleteCategory(category: Category) {
    this.actionSheetService.presentDeleteConfirm(
      category.name,
      () => {
        this.categories = this.categories.filter((item: Category) => item.id !== category.id);
        this.tasks = this.tasks.map((task: Task) =>
          task.categoryId === category.id ? { ...task, categoryId: undefined } : task,
        );
        if (this.filterCategoryId === category.id) {
          this.filterCategoryId = 'all';
        }
        this.saveCategories();
        this.saveTasks();
        this.cdr.markForCheck();
      },
      'Eliminar categoría',
    );
  }

  private existsCategory(name: string) {
    return this.categories.find(
      (item: Category) => item.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }

  saveCategories() {
    Preferences.set({
      key: this.CATEGORIES_KEY,
      value: JSON.stringify(this.categories),
    });
  }
}
