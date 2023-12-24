import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/Todo';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  @Input() todo: Todo | undefined;
  @Output() editTodo: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeTodo: EventEmitter<void> = new EventEmitter<void>();
  @Output() toggleTodo: EventEmitter<boolean> = new EventEmitter<boolean>();

  isEditing: boolean = false;

  enableEditing(): void {
    if (this.todo?.completed) {
      return;
    }
    this.isEditing = true;
  }

  updateDescription(value: string): void {
    if (value !== this.todo?.description) {
      this.editTodo.emit(value);
    }
    this.isEditing = false;
  }
}
