import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
	output,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ImageHelper } from '../../../helpers/image.helper';
import { ILink } from '../../../interfaces/link';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

declare const bootstrap: any;

@Component({
	selector: 'app-card',
	standalone: true,
	imports: [ConfirmationDialogComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './card.component.html',
	styleUrl: './card.component.scss',
})
export class CardComponent implements AfterViewInit {
	id = input<number>();
	imgData = input<any>();
	isSystem = input<boolean>(false);
	links = input<ILink[]>([]);
	title = input<string>();
	emitDeleteCard = output<number>();
	emitEditCard = output<number>();

	additionalLinks = computed(() =>
		this.links().filter((link) => !link.isDefault),
	);
	img = computed(() => {
		if (!this.isSystem() && this.imgData()?.data) {
			return this._imageHelper.generateBase64(this.imgData().data.data);
		}
		return null;
	});
	qtyLinks = computed(() =>
		this.links().length > 1 ? this.links().length - 1 : 0,
	);

	@ViewChild('dropdownAdditionalLinks')
	dropdownAdditionalLinks: ElementRef;
	@ViewChild('dropdownEllipsis') dropdownEllipsis: ElementRef;

	private _imageHelper = new ImageHelper();
	private _router = inject(Router);

	ngAfterViewInit(): void {
		if (this.dropdownEllipsis) {
			this.dropdownEllipsis = new bootstrap.Dropdown(
				this.dropdownEllipsis.nativeElement,
			);
		}
		if (this.dropdownAdditionalLinks) {
			this.dropdownAdditionalLinks = new bootstrap.Dropdown(
				this.dropdownAdditionalLinks.nativeElement,
			);
		}
	}

	/**
	 * Opens a given URL in a new tab.
	 *
	 * @param event The DOM event that triggered the function.
	 * @param url The URL to open.
	 */
	openLink(event: Event, url: string): void {
		event.preventDefault();
		event.stopPropagation();
		(this.dropdownAdditionalLinks as any).hide();
		window.open(url, '_blank');
	}

	/**
	 * Handles the click event on the card.
	 * If the card represents a system, it navigates to the 'new' route.
	 * Otherwise, it opens the default link associated with the card.
	 *
	 * @param event The DOM event that triggered the function.
	 */
	onCardClick(event: Event): void {
		if (this.isSystem()) {
			this.goToCreateNew();
			return;
		}

		const defaultLink = this.links().filter((link) => link.isDefault);
		if (defaultLink.length > 0) {
			this.openLink(event, defaultLink[0].link);
		}
	}

	/**
	 * Handles the delete card event.
	 * Stops event propagation and emits the card ID to be deleted.
	 * @param event The DOM event.
	 */
	onDeleteCard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.emitDeleteCard.emit(this.id());
	}

	/**
	 * Handles the edit card event.
	 * Stops event propagation and emits the card ID to be edited.
	 * @param event The DOM event.
	 */
	onEditCard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.emitEditCard.emit(this.id());
	}

	/**
	 * Navigates to the 'new' route to create a new item.
	 */
	goToCreateNew(): void {
		this._router.navigateByUrl('new');
	}
}
