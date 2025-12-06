import { IImage } from './image';
import { ILink } from './link';
import { IUser } from './user';

export interface IApplication {
	id?: number;
	name: string;
	color?: string;
	image?: IImage;
	order?: string;
	user?: IUser;
	links?: ILink[];
}
