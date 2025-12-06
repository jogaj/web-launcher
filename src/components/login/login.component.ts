import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Constants } from '../../enums/constants';
import { ToastEventType } from '../../enums/toast-event-type';
import { IUser } from '../../interfaces/user';
import { LocalStoreService } from '../../services/local-store.service';
import { SettingsService } from '../../services/settings.service';
import { StateService } from '../../services/state.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-login',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	formBuilder = inject(FormBuilder);

	private _router = inject(Router);
	private _toastSvc = inject(ToastService);
	private _userSvc = inject(UserService);
	private _localStoreSvc = inject(LocalStoreService);
	private _stateService = inject(StateService);
	private _settingsService = inject(SettingsService);

	authForm: FormGroup;
	maxLengthText = 20;

	get formControls(): { [key: string]: AbstractControl } {
		return this.authForm.controls;
	}

	get userNameFormControl(): AbstractControl {
		return this.formControls['username'];
	}

	get passwordFormControl(): AbstractControl {
		return this.formControls['password'];
	}

	get userNameHasErrors(): boolean {
		return (
			this.userNameFormControl.touched &&
			this.userNameFormControl.errors !== null
		);
	}

	get passwordHasErrors(): boolean {
		return (
			this.passwordFormControl.touched &&
			this.passwordFormControl.errors !== null
		);
	}

	ngOnInit(): void {
		this.authForm = this.formBuilder.group({
			username: [
				'',
				[Validators.required, Validators.maxLength(this.maxLengthText)],
			],
			password: [
				'',
				[Validators.required, Validators.maxLength(this.maxLengthText)],
			],
		});

		if (this._localStoreSvc.get(Constants.AuthKey)) {
			this._loadSettings();
		}
	}

	/**
	 * Handles the sign-in form submission.
	 * Validates the form and calls the login method.
	 */
	onSignIn(): void {
		this._toastSvc.clear();

		if (this._fieldHasErrors() || this.authForm.invalid) return;

		this._login(this.userNameFormControl.value, this.passwordFormControl.value);
	}

	/**
	 * Validates form fields and displays a toast message for any errors.
	 * @returns True if there are validation errors, otherwise false.
	 */
	private _fieldHasErrors(): boolean {
		let hasError = false;
		let errorMessage = null;
		if (!this.userNameFormControl.value && !this.passwordFormControl.value) {
			errorMessage = 'Username and Password are required.';
		} else if (!this.userNameFormControl.value) {
			errorMessage = 'Username is required.';
		} else if (!this.passwordFormControl.value) {
			errorMessage = 'Password is required.';
		}

		if (errorMessage !== null) {
			this._toastSvc.showToast(
				'Error',
				errorMessage,
				ToastEventType.Error,
				0,
				false,
			);
			this.userNameFormControl.markAsTouched();
			this.passwordFormControl.markAsTouched();
			hasError = true;
		}

		return hasError;
	}

	/**
	 * Authenticates the user with the provided credentials.
	 * On success, stores the token and loads user settings.
	 * @param username The user's username.
	 * @param password The user's password.
	 */
	private _login(username: string, password: string): void {
		const userCred: IUser = {
			username,
			password,
		};
		this._userSvc
			.login(userCred)
			.pipe(take(1))
			.subscribe((result) => {
				this._localStoreSvc.set(Constants.AuthKey, result);
				this._stateService.setCurrentUser(username);
				this._loadSettings();
			});
	}

	/**
	 * Fetches user settings and navigates to the main view upon success.
	 */
	private _loadSettings(): void {
		this._settingsService
			.getByUser()
			.pipe(take(1))
			.subscribe(() => {
				this._router.navigateByUrl('main-view');
			});
	}
}
