import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	input,
	OnInit,
	output,
	ViewChild,
} from '@angular/core';
import Toast from 'bootstrap/js/dist/toast';
import { fromEvent, take } from 'rxjs';
import { ToastEventType } from '../../../enums/toast-event-type';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './toast.component.html',
	styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
	type = input<ToastEventType>();
	title = input<string>();
	message = input<string>();
	delay = input<number>();
	autoHide = input<boolean>();

	disposeEvent = output();

	@ViewChild('toastElement', { static: true }) toastEl!: ElementRef;

	toast!: Toast;
	readonly ToastEventType = ToastEventType;

	ngOnInit(): void {
		this.show();
	}

	/**
	 * Initializes and shows the toast component, and sets up an event listener
	 * to dispose of it once it's hidden.
	 */
	show(): void {
		this.toast = new Toast(this.toastEl.nativeElement, this._getOptions());

		fromEvent(this.toastEl.nativeElement, 'hidden.bs.toast')
			.pipe(take(1))
			.subscribe(() => this.hide());

		this.toast.show();
	}

	/**
	 * Disposes the toast instance and emits an event to signal its removal.
	 */
	hide(): void {
		this.toast.dispose();
		this.disposeEvent.emit();
	}

	/**
	 * Builds the configuration object for the Bootstrap toast from component inputs.
	 * @returns The partial options for the toast.
	 */
	private _getOptions(): Partial<Toast.Options> {
		const result: Partial<Toast.Options> = {
			autohide: this.autoHide(),
		};

		if (this.autoHide() === true) {
			result.delay = this.delay();
		}

		return result;
	}
}
