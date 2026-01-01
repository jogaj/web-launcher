import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
	selector: 'app-toggle-group-item',
	standalone: true,
	imports: [],
	templateUrl: './toggle-group-item.component.html',
	styleUrl: './toggle-group-item.component.scss',
	host: {
		class: 'app-toggle-group-items',
	},
})
export class ToggleGroupItemComponent {
	value = input<string>();
	checked = input<boolean>(false);
	isFirst = input<boolean>();
	isLast = input<boolean>();
	@Output() itemClicked = new EventEmitter<string>();

	/**
	 * Handles the click event on the toggle item.
	 * Prevents default event behavior and emits the item's value.
	 * @param event The DOM event.
	 * @param val The value of the clicked item.
	 */
	onItemClick(event: any, val: string): void {
		event.preventDefault();
		event.stopPropagation();
		this.itemClicked.emit(val);
	}
}
