export interface IAutorizeData {
	username: string;
	iat: number;
	exp: number;
}

export interface IAutorize {
	data: IAutorizeData;
}
