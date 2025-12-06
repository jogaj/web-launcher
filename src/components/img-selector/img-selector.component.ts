import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	output,
	signal,
	ɵunwrapSafeValue as unwrapSafeValue,
} from '@angular/core';
import { Constants } from '../../enums/constants';
import { IImage } from '../../interfaces/image';

@Component({
	selector: 'app-img-selector',
	standalone: true,
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './img-selector.component.html',
	styleUrl: './img-selector.component.scss',
})
export class ImgSelectorComponent {
	images = input<IImage[]>([]);
	selectedImage = input<IImage>();
	emitImgClicked = output<IImage>();

	_selectedImage = signal<IImage>(null);
	readonly Constants = Constants;
	readonly unwrapSafeValue = unwrapSafeValue;

	constructor() {
		effect(
			() => {
				this._selectedImage.set(this.selectedImage());
			},
			{
				allowSignalWrites: true, // Enable writing to signals inside effects
			},
		);
	}

	/**
	 * Handles the click event on an image.
	 * Sets the clicked image as selected and emits it to the parent component.
	 * @param img The image that was clicked.
	 */
	onImgClick(img: IImage): void {
		this._selectedImage.set(img);
		this.emitImgClicked.emit(img);
	}
}
