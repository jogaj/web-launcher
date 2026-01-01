import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchBoxService } from '../../services/search-box.service';

@Component({
	selector: 'app-search-box',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './search-box.component.html',
	styleUrl: './search-box.component.scss',
	host: {
		class: 'app-search-box',
	},
})
export class SearchBoxComponent {
	private _searchSvc = inject(SearchBoxService);

	text: string;

	/**
	 * Handles the text change event from the input field.
	 * Updates the search service with the new text value.
	 * @param event The new text value from the input.
	 */
	onTextChange(event: string): void {
		this._searchSvc.searchText$.next(event);
	}

	/**
	 * Clears the search input field and notifies the search service.
	 */
	onClearValue(): void {
		this.text = '';
		this._searchSvc.searchText$.next('');
	}
}
