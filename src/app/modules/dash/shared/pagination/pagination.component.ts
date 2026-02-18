import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Input() isLoading$: Observable<boolean>;
  @Input() totalRecords: number;
  @Input() disabled: boolean = false;
  @Input() size: number = 10;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
}
