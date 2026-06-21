import api from '@/src/lib/api'
import { LoginInput } from '../schema/schema'
import { RegisterInput } from '../schema/schema';

export const login = (data: LoginInput) =>
    api.post("api/Auth/login", data);

export const register = (data: RegisterInput) =>
    api.post("api/Auth/register", data)

