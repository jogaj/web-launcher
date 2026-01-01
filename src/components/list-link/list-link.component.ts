import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ILink } from '../../interfaces/link';
import { LinkComponent } from './link/link.component';

const LIST_LINK_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => ListLinkComponent),
	multi: true,
};

@Component({
	selector: 'app-list-link',
	standalone: true,
	imports: [FormsModule, LinkComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [LIST_LINK_VALUE_ACCESSOR],
	templateUrl: './list-link.component.html',
	styleUrl: './list-link.component.scss',
})
export class ListLinkComponent implements ControlValueAccessor {
	private _newId = -1;
	private _value: ILink[] = [];

	get value(): ILink[] {
		return this._value;
	}

	set value(newValue: ILink[]) {
		this._value = newValue;
		this.onChangeCallback(newValue);
		// this.valueChanged.emit(newValue);
	}

	get visibleLinks(): ILink[] {
		return this._value.filter((link) => !link.isRemoved);
	}

	onChangeCallback: (value: any) => void = () => {};

	onTouchedCallback: (value: any) => void = () => {};

	writeValue(val: ILink[]): void {
		this._value = val;
	}

	registerOnChange(fn: any): void {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchedCallback = fn;
	}

	setDisabledState?(_: boolean): void {}

	/**
	 * Adds a new empty link to the list.
	 * If no default link exists, the new link is set as the default.
	 */
	addNewLink(): void {
		const newLink: ILink = {
			id: this._newId,
			link: null,
		};
		this._newId--;
		if (!this.value.some((link) => link.isDefault)) {
			newLink.isDefault = true;
		}
		this.value.push(newLink);
	}

	/**
	 * Marks a link for removal by its ID.
	 * @param linkId The ID of the link to remove.
	 */
	onRemoveLink(linkId: number): void {
		this.value.find((link) => link.id === linkId).isRemoved = true;
	}

	/**
	 * Sets a specific link as the default link.
	 * If the link is not already the default, it updates the list.
	 * @param linkId The ID of the link to set as the default.
	 */
	onFavoriteLink(linkId: number): void {
		const newValue = structuredClone(this.value);
		const targetLink = newValue.find((link) => link.id === linkId);
		if (!targetLink.isDefault) {
			// Change current default link
			newValue.find((link) => link.isDefault).isDefault = false;
			// Setting the target link to default
			targetLink.isDefault = true;
			this.value = newValue;
		}
	}
}
