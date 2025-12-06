import { inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export class ImageHelper {
	private _sanitizer: DomSanitizer = inject(DomSanitizer);

	/**
	 * Converts a byte array buffer into a base64 encoded URL that can be safely used in Angular templates.
	 *
	 * @param buffer The image data as a byte array (e.g., { type: 'Buffer', data: [...] }).
	 * @returns A SafeUrl object containing the base64 encoded image URL.
	 */
	generateBase64(buffer: any): SafeUrl {
		const imageBlob = new Uint8Array(buffer);
		const charString = imageBlob.reduce((data, byte) => {
			return data + String.fromCharCode(byte);
		}, '');
		return this._sanitizer.bypassSecurityTrustUrl(charString);
	}
}
