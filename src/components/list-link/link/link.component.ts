import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ILink } from '../../../interfaces/link';

@Component({
	selector: 'app-link',
	standalone: true,
	imports: [FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './link.component.html',
	styleUrl: './link.component.scss',
})
export class LinkComponent {
	item = input<ILink>(null);
	emitDeleteLink = output<number>();
	emitFavoriteLink = output<number>();

	/**
	 * Toggles the edit mode for the link item.
	 */
	onEditClick(): void {
		this.item().isEditMode = !this.item().isEditMode;
	}

	/**
	 * Emits the link's ID to be deleted.
	 */
	onDeleteLinkClick(): void {
		this.emitDeleteLink.emit(this.item().id);
	}

	/**
	 * Emits the link's ID to be marked as a favorite.
	 */
	onFavoriteClick(): void {
		this.emitFavoriteLink.emit(this.item().id);
	}
}
