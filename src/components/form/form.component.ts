import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	input,
	signal,
	ɵunwrapSafeValue as unwrapSafeValue,
} from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ElSegundo } from '@swimlane/el-segundo';
import { ToastEventType } from '../../enums/toast-event-type';
import { ImageHelper } from '../../helpers/image.helper';
import { IApplication } from '../../interfaces/application';
import { IFormBody } from '../../interfaces/form-body';
import { IImage } from '../../interfaces/image';
import { ILink } from '../../interfaces/link';
import { ApplicationService } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';
import { ImgSelectorComponent } from '../img-selector/img-selector.component';
import { ListLinkComponent } from '../list-link/list-link.component';
import { ToggleGroupComponent } from '../toggle-group/toggle-group.component';

@Component({
	selector: 'app-form',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ImgSelectorComponent,
		ToggleGroupComponent,
		ListLinkComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './form.component.html',
	styleUrl: './form.component.scss',
})
export class FormComponent {
	application = input<IApplication>();

	formBuilder = inject(FormBuilder);
	destroyRef = inject(DestroyRef);
	itemForm: FormGroup;
	maxLengthText = 20;

	private _imageHelper = new ImageHelper();
	private _router = inject(Router);
	private _toastSvc = inject(ToastService);
	private _appSvc = inject(ApplicationService);
	private _selectedFile: File | null = null;
	private _selectedFile64: any = null;
	private _selectedImageId: null | number = null;
	private _dirtyTracking: ElSegundo;

	TOGGLE_ITEM_NEW = 'Upload new';
	TOGGLE_ITEM_EXISTING = 'Select existing';
	toggleGroupItems = [this.TOGGLE_ITEM_NEW, this.TOGGLE_ITEM_EXISTING];

	preExistingImages = signal<IImage[]>([]);
	selectedImage = signal<IImage>(null);

	/**
	 * Determines the title of the form based on the current route.
	 * @returns 'New' if the route is '/new', otherwise 'Edit'.
	 */
	get getTitle(): string {
		return this._router.url === '/new' ? 'New' : 'Edit';
	}

	/**
	 * Provides a convenient way to access all form controls.
	 * @returns An object containing all form controls by their names.
	 */
	get formControls(): { [key: string]: AbstractControl } {
		return this.itemForm.controls;
	}

	/**
	 * Gets the form control for the card name input.
	 * @returns The AbstractControl for 'cardNameInput'.
	 */
	get cardNameFormControl(): AbstractControl {
		return this.formControls['cardNameInput'];
	}

	/**
	 * Gets the form control for the color input.
	 * @returns The AbstractControl for 'colorInput'.
	 */
	get colorFormControl(): AbstractControl {
		return this.formControls['colorInput'];
	}

	/**
	 * Gets the form control for the file input.
	 * @returns The AbstractControl for 'fileInput'.
	 */
	get fileFormControl(): AbstractControl {
		return this.formControls['fileInput'];
	}

	/**
	 * Gets the form control for the file toggle.
	 * @returns The AbstractControl for 'fileToggle'.
	 */
	get fileToggleControl(): AbstractControl {
		return this.formControls['fileToggle'];
	}

	/**
	 * Gets the form control for the list of links.
	 * @returns The AbstractControl for 'listLinks'.
	 */
	get listLinksControl(): AbstractControl {
		return this.formControls['listLinks'];
	}

	/**
	 * Checks if the card name form control has errors and has been touched.
	 * @returns True if there are errors and the control has been touched, otherwise false.
	 */
	get cardNameHasErrors(): boolean {
		return (
			this.cardNameFormControl.touched &&
			this.cardNameFormControl.errors !== null
		);
	}

	/**
	 * Checks if the link list form control has errors and has been touched.
	 * @returns True if there are errors and the control has been touched, otherwise false.
	 */
	get linkListHasErrors(): boolean {
		return (
			this.listLinksControl.touched && this.listLinksControl.errors !== null
		);
	}

	/**
	 * Checks if the form has been modified from its initial state.
	 * @returns True if the form is dirty, otherwise false.
	 */
	get isFormDirty(): boolean {
		return this._dirtyTracking.check(this._buildBody());
	}

	constructor() {
		this._appSvc.getAll().subscribe((app) => {
			this.preExistingImages.set(
				app.reduce((acc: IImage[], a: IApplication) => {
					if (!acc.find((accum) => accum.id === a.image?.id)) {
						acc.push({
							id: a.image?.id,
							data: {
								data: this._imageHelper.generateBase64(a.image?.data.data),
							},
						});
					}
					return acc;
				}, []),
			);
		});
	}

	/**
	 * Initializes the form with default values and validators.
	 */
	ngOnInit(): void {
		this.itemForm = this.formBuilder.group({
			cardNameInput: [
				'',
				[Validators.required, Validators.maxLength(this.maxLengthText)],
			],
			colorInput: [''],
			fileInput: [''],
			fileToggle: [this.TOGGLE_ITEM_NEW],
			listLinks: [[], [Validators.required, this._validateUrlArray]],
		});

		if (this.application()) {
			this.itemForm.setValue({
				fileToggle: this.application().image
					? this.TOGGLE_ITEM_EXISTING
					: this.TOGGLE_ITEM_NEW,
				fileInput: this._imageHelper.generateBase64(
					this.application().image?.data.data,
				),
				cardNameInput: this.application().name,
				colorInput: this.application().color,
				listLinks: this.application().links,
			});
			this.selectedImage.set({
				id: this.application().image.id,
				data: {
					data: this._imageHelper.generateBase64(
						this.application().image?.data.data,
					),
				},
			});
			this._selectedImageId = this.application().image.id;
		}

		// Initialize the base snapshot
		this._dirtyTracking = new ElSegundo(this._buildBody());
	}

	/**
	 * Handles the file selection event from the file input.
	 * Reads the selected file as a base64 string and updates the form.
	 * @param event The DOM event from the file input element.
	 */
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this._selectedFile = input.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(this._selectedFile);
			reader.onload = (e: ProgressEvent<FileReader>) => {
				this._selectedFile64 = e.target.result;
				this.itemForm.get('fileInput')?.updateValueAndValidity();
				this._selectedImageId = null;
			};
		}
	}

	/**
	 * Handles the click event when a pre-existing image is selected from the image selector.
	 * It patches the form with the selected image's data, updates the control's validity,
	 * and stores the selected image's ID.
	 * @param event The image object that was clicked, containing its ID and data.
	 */
	onImgClicked(event: IImage): void {
		this.itemForm.patchValue({ fileInput: unwrapSafeValue(event.data.data) });
		this.itemForm.get('fileInput')?.updateValueAndValidity();
		this._selectedImageId = event.id;
	}

	/**
	 * Handles the cancel action, clears toasts, and navigates to the main view.
	 */
	onCancel(): void {
		this._toastSvc.clear();
		this._goToMain();
	}

	/**
	 * Handles the form submission. Validates the form, builds the request body,
	 * and calls the application service to add the new application.
	 * Displays success or error toasts and navigates to the main view on success.
	 */
	onSubmit(): void {
		this._toastSvc.clear();

		if (this._formHasErrors() || this.itemForm.invalid) return;

		const serviceCall$ =
			this._router.url === '/new'
				? this._appSvc.add(this._buildBody())
				: this._appSvc.update({
						...this._buildBody(),
						id: this.application().id,
					});

		serviceCall$.subscribe((result) => {
			const type = this._toastSvc.showToastFromApi(result);
			if (type === ToastEventType.Success) {
				this._goToMain();
			}
		});
	}

	/**
	 * Custom validator for the list of links.
	 * Checks if there's at least one non-removed link and if all non-removed links have valid URLs.
	 * @param control The FormArray containing the links.
	 */
	private _validateUrlArray(
		control: FormArray,
	): { [key: string]: boolean } | null {
		const urls = control.value.filter((url: ILink) => !url.isRemoved);
		if (
			!urls.length ||
			urls.some(
				(url: ILink) =>
					RegExp(
						/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
					).test(url.link) === false,
			)
		) {
			return { invalid: true };
		}
		return null;
	}

	/**
	 * Checks for form errors, specifically for the card name and link list.
	 * Displays toast messages for validation errors.
	 */
	private _formHasErrors(): boolean {
		let hasError = false;
		const errorMessage: string[] = [];
		if (!this.cardNameFormControl.value) {
			errorMessage.push('Name is required');
		}

		this.listLinksControl.markAsTouched();
		this.listLinksControl.updateValueAndValidity();
		if (this.linkListHasErrors) {
			errorMessage.push('At least one link is required');
		}

		if (errorMessage.length) {
			this._toastSvc.showToast(
				'Error',
				errorMessage.join('\n'),
				ToastEventType.Error,
				0,
				false,
			);
			this.cardNameFormControl.markAsTouched();
			hasError = true;
		}

		return hasError;
	}

	/**
	 * Builds the request body for adding a new application.
	 * @returns An object containing the application data.
	 */
	private _buildBody(): IFormBody {
		const formData = {} as IFormBody;
		formData.name = this.cardNameFormControl.value;
		formData.color = this.colorFormControl.value;
		formData.links = this.listLinksControl.value;

		const imageFile = this.fileFormControl.value;
		if (imageFile && this._selectedFile64) {
			// Uploaded image
			formData.image = this._selectedFile64;
			formData.imageId = null;
		} else {
			// Pre-existing images
			formData.image = imageFile;
			formData.imageId = this._selectedImageId;
		}
		return formData;
	}

	/**
	 * Navigates to the 'main-view' route.
	 */
	private _goToMain(): void {
		this._router.navigateByUrl('main-view');
	}
}
