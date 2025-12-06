import { ILink } from './link';

export interface IFormBody {
	name: string;
	color: string;
	links: ILink[];
	image: any;
	imageId?: number;
	id?: number;
}
