import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Todo } from '../../models/Todo';
import { QueryResult } from '../../models/QueryResult';
import { QueryParams } from '../../models/QueryParams';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private readonly todoListKey = 'todo-list';
  private todoListSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  constructor(
    private localStorageSvc: LocalStorageService,
  ) {
    const storedTodoList = this.localStorageSvc.getAsTypedList<Todo>(this.todoListKey);
    this.todoListSubject.next(storedTodoList);

    this.todoListSubject.subscribe((todoList) => {
      this.localStorageSvc.setValue(this.todoListKey, JSON.stringify(todoList));
    });
  }

  getTodoList$(queryParams: QueryParams<Todo>): Observable<QueryResult<Todo>> { 
    return this.todoListSubject.asObservable().pipe(
      map((td) => {
        let todos = [...td];
        if (queryParams.searchTerm) {
          todos = todos.filter((t) => t.description.includes(queryParams.searchTerm));
        }
        if (queryParams.sortBy) {
          todos = todos.sort((a, b) => {
            if (a[queryParams.sortBy as keyof Todo] < b[queryParams.sortBy as keyof Todo]) {
              return queryParams.sortDirection === 'asc' ? -1 : 1;
            }
            if (a[queryParams.sortBy as keyof Todo] > b[queryParams.sortBy as keyof Todo]) {
              return queryParams.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
          });
        }
        if (queryParams.predicates) {
          queryParams.predicates.forEach((predicate) => {
            todos = todos.filter(predicate);
          });
        }
        const total = todos.length;
        // const lastPage = Math.ceil(total / queryParams.size);
        // const currentPage = Math.min(queryParams.page, lastPage);
        // const startIndex = (currentPage - 1) * queryParams.size;
        // const endIndex = Math.min(startIndex + queryParams.size, total);
        // return { data: td.slice(startIndex, endIndex), total };
        return { data: todos.slice((queryParams.page - 1) * queryParams.size, queryParams.page * queryParams.size), total };
      })
    ); 
  }

  addTodo(description: string): void {
    const currentTodos = this.todoListSubject.getValue();
    const id = currentTodos.length > 0 ? currentTodos[currentTodos.length - 1].id + 1 : 1;
    const todo = {
      id: id,
      completed: false,
      dateCreated: new Date(),
      description,
    }
    this.todoListSubject.next([...currentTodos, todo]);
  }

  editTodo(id: number, updatedTodo: Todo): void {
    const currentTodos = this.todoListSubject.getValue();
    const index = currentTodos.findIndex(x => x.id == id);
    if (index < 0) {
      return;
    }
    currentTodos[currentTodos.findIndex(x => x.id == id)] = updatedTodo;
    this.todoListSubject.next(currentTodos);
  }

  removeTodo(id: number): void {
    const currentTodos = this.todoListSubject.getValue();
    const index = currentTodos.findIndex(x => x.id == id);
    if (index < 0) {
      return;
    }
    currentTodos.splice(index, 1);
    this.todoListSubject.next(currentTodos);
  }

  clearTodoList(): void {
    this.todoListSubject.next([]);
  }
}
