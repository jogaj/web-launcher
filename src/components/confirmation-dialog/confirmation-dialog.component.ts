import {
	Component,
	ElementRef,
	EventEmitter,
	OnDestroy,
	Output,
	signal,
	ViewChild,
	WritableSignal,
} from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';

@Component({
	selector: 'app-confirmation-dialog',
	standalone: true,
	imports: [],
	templateUrl: './confirmation-dialog.component.html',
	styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnDestroy {
	title: WritableSignal<string> = signal('Confirmation');
	message: WritableSignal<string> = signal('Are you sure?');
	@Output() close = new EventEmitter<boolean>();

	@ViewChild('confirmDialogElementRef') confirmDialogElementRef: ElementRef;

	private modal?: Modal;

	constructor(private elementRef: ElementRef) {}

	/**
	 * Initializes the Bootstrap modal instance.
	 * It's configured to be static so it cannot be closed by clicking the backdrop or pressing the Esc key.
	 */
	initialize(): void {
		this.modal = new Modal(this.elementRef.nativeElement.firstElementChild, {
			backdrop: 'static', // Prevents closing on backdrop click
			keyboard: false, // Prevents closing with Esc key
		});
	}

	ngOnDestroy(): void {
		this.modal?.dispose();
	}

	/**
	 * Initializes and shows the confirmation dialog.
	 */
	show(): void {
		this.initialize();
		this.modal?.show();
	}

	/**
	 * Handles the user's confirmation. Hides the modal and emits `true`.
	 */
	confirm(): void {
		this.modal?.hide();
		this.close.emit(true);
	}

	/**
	 * Handles the user's cancellation. Hides the modal and emits `false`.
	 */
	cancel(): void {
		this.modal?.hide();
		this.close.emit(false);
	}
}
