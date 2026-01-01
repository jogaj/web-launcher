import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
	debounceTime,
	EMPTY,
	map,
	Subject,
	switchMap,
	take,
	takeUntil,
} from 'rxjs';
import { Constants } from '../../enums/constants';
import { ToastEventType } from '../../enums/toast-event-type';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { SearchBoxService } from '../../services/search-box.service';
import { ToastService } from '../../services/toast.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CardComponent } from './card/card.component';

@Component({
	selector: 'app-list-card',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CardComponent, CommonModule, SpinnerComponent],
	templateUrl: './list-card.component.html',
	styleUrl: './list-card.component.scss',
})
export class ListCardComponent implements OnInit, OnDestroy {
	readonly Constants = Constants;
	private _applicationSvc = inject(ApplicationService);
	private _searchSvc = inject(SearchBoxService);
	private _confirmDialogSvc = inject(ConfirmationDialogService);
	private _toastSvc = inject(ToastService);
	private _router = inject(Router);
	private destroy$ = new Subject<void>();

	loading = signal<boolean>(true);
	applications = signal<Array<IApplication>>([]);
	filter = toSignal<string>(
		this._searchSvc.searchText$.pipe(
			takeUntil(this.destroy$),
			debounceTime(400),
			map((value) => value.toLowerCase()),
		),
	);
	applicationsFilterd = computed(() => {
		if (!this.filter()) return [...this.applications()];

		return [
			...this.applications().filter((a) =>
				a.name.toLowerCase().startsWith(this.filter()),
			),
		];
	});

	ngOnInit(): void {
		this._getApplications();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Handles the delete card event.
	 * Prompts for confirmation, deletes the application, and refreshes the list on success.
	 * @param applicationId The ID of the application to delete.
	 */
	onDeleteCardHandler(applicationId: number): void {
		this._confirmDialogSvc
			.open(
				'Delete Application',
				'Are you sure you want to remove this application?',
			)
			.pipe(
				switchMap((isOk: boolean) => {
					if (!isOk) return EMPTY;

					return this._applicationSvc.delete(applicationId);
				}),
				take(1),
			)
			.subscribe((result) => {
				const type = this._toastSvc.showToastFromApi(result);
				if (type === ToastEventType.Success) {
					this._getApplications();
				}
			});
	}

	/**
	 * Handles the edit card event.
	 * Navigates to the edit page for the specified application.
	 * @param applicationId The ID of the application to edit.
	 */
	onEditCardHandler(applicationId: number): void {
		this._router.navigateByUrl(`edit/${applicationId}`);
	}

	/**
	 * Fetches all applications from the service and updates the component's state.
	 */
	private _getApplications(): void {
		this._applicationSvc.getAll().subscribe((val) => {
			this.applications.set(val);
			this.loading.set(false);
		});
	}
}
