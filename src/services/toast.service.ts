import { Injectable, signal } from '@angular/core';
import { ToastEventType } from '../enums/toast-event-type';
import { IApiMessage } from '../interfaces/api-message';
import { IToastEvent } from '../interfaces/toast-event';

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	toastEvents = signal<IToastEvent[]>([]);

	/**
	 * Show toast notification.
	 *
	 * @param title Toast title
	 * @param message Toast message
	 */
	showToast(
		title: string,
		message: string = 'Message',
		type: ToastEventType = ToastEventType.Info,
		delay: number = 4000,
		autoHide: boolean = true,
	): void {
		this.toastEvents.update((event) => {
			event.push({
				id: Date.now().toString(),
				message,
				title,
				type,
				delay,
				autoHide,
			});
			return event;
		});
	}

	/**
	 * Closes a specific toast notification by its ID.
	 * @param id The ID of the toast to close.
	 */
	closeToast(id: string): void {
		this.toastEvents.update((v) => {
			return v.filter((t) => t.id !== id);
		});
	}

	/**
	 * Clears all currently displayed toast notifications.
	 */
	clear(): void {
		this.toastEvents.set([]);
	}

	/**
	 * Shows a toast notification based on an API response message.
	 * Determines if the toast should be a 'Success' or 'Error' type.
	 * @param result The API message object.
	 * @returns The type of toast that was displayed.
	 */
	showToastFromApi(result: IApiMessage): ToastEventType {
		const title = 'error' in result ? 'Error' : 'Success';
		const type =
			'error' in result ? ToastEventType.Error : ToastEventType.Success;
		this.showToast(title, result.msg, type);
		return type;
	}

	// https://github.com/svierk/angular-bootstrap-toast-service/blob/main/src/app/components/toast/toast.component.spec.ts
}
