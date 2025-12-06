import { ToastEventType } from '../enums/toast-event-type';

export interface IToastEvent {
	id: string;
	type: ToastEventType;
	title: string;
	message: string;
	delay: number;
	autoHide: boolean;
}
