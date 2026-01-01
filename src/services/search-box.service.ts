import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SearchBoxService {
	searchText$: BehaviorSubject<string>;

	get searchText(): string {
		return this.searchText$.getValue();
	}

	constructor() {
		this.searchText$ = new BehaviorSubject<string>('');
	}
}
