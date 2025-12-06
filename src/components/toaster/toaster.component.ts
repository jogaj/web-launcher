import { Component, inject, Signal } from '@angular/core';
import { IToastEvent } from '../../interfaces/toast-event';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from './toast/toast.component';

@Component({
	selector: 'app-toaster',
	standalone: true,
	imports: [ToastComponent],
	templateUrl: './toaster.component.html',
	styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
	private _toastSvc = inject(ToastService);

	toastArray: Signal<IToastEvent[]> = this._toastSvc.toastEvents;

	dispose(id: string): void {
		this._toastSvc.closeToast(id);
	}
}
