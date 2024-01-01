import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import { TodoListService } from './services/todo-list.service';
import { TodoItemComponent } from './todo-item/todo-item.component';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

const MaterialModules = [
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [
    TodoComponent,
    TodoItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TodoRoutingModule,
    ...MaterialModules,
  ],
  providers: [
    TodoListService,
  ]
})
export class TodoModule { }
