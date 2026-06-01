import { AuthService } from './AuthService';
import { LocalStorageService } from './LocalStorageService';

export const authService = new AuthService(new LocalStorageService());
