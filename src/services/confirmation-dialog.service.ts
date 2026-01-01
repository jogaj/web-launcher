import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	EnvironmentInjector,
	Injectable,
	inject,
} from '@angular/core';
import { finalize, Observable, take } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class ConfirmationDialogService {
	private _injector = inject(EnvironmentInjector);
	private _applicationRef = inject(ApplicationRef);

	open(title: string, message: string): Observable<boolean> {
		// Create a component reference
		const componentRef = createComponent(ConfirmationDialogComponent, {
			environmentInjector: this._injector,
		});

		// Set the inputs using signals
		componentRef.instance.title.set(title);
		componentRef.instance.message.set(message);

		// Attach component to the application reference to make it part of the change detection tree
		this._applicationRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);

		// Show the modal
		componentRef.instance.show();

		// Return the close event emitter as an observable, handling cleanup
		return componentRef.instance.close.pipe(
			take(1), // The observable completes after the first emission
			finalize(() => this.destroyModal(componentRef)), // Clean up the component
		);
	}

	private destroyModal(
		componentRef: ComponentRef<ConfirmationDialogComponent>,
	): void {
		if (componentRef) {
			this._applicationRef.detachView(componentRef.hostView);
			componentRef.destroy();
		}
	}
}
