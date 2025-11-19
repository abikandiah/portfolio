
import { stringToBoolean } from '@abumble/design-system/utils';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
	constructionDisabled: stringToBoolean(process.env.VITE_CONSTRUCTION_DISABLED)
};
