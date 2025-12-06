import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleGroupItemComponent } from './toggle-group-item/toggle-group-item.component';

const TOGGLE_GROUP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => ToggleGroupComponent),
	multi: true,
};

@Component({
	selector: 'app-toggle-group',
	standalone: true,
	imports: [ToggleGroupItemComponent],
	providers: [TOGGLE_GROUP_VALUE_ACCESSOR],
	templateUrl: './toggle-group.component.html',
	styleUrl: './toggle-group.component.scss',
})
export class ToggleGroupComponent implements ControlValueAccessor {
	@Input() items: string[] = [];
	@Output() valueChanged = new EventEmitter<string>();

	private _value: any = null;

	get value(): any {
		return this._value;
	}

	set value(newValue: string) {
		this._value = newValue;
		this.onChangeCallback(newValue);
		this.valueChanged.emit(newValue);
	}

	onChangeCallback: (value: any) => void = () => {};

	onTouchedCallback: (value: any) => void = () => {};

	writeValue(val: any): void {
		this._value = val;
	}

	registerOnChange(fn: any): void {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchedCallback = fn;
	}

	setDisabledState?(_: boolean): void {}

	valueChangeHandler(newValue: string) {
		this.value = newValue;
	}
}
