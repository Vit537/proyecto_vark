import { apiRequest } from './client';
import type {
  CompletarTestPayload,
  CompletarTestResponse,
  LoginPayload,
  LoginResponse,
  PerfilVARK,
  RegistroPayload,
  Usuario,
  VARKTestResponse,
} from './types';

// CU-01: Registro
export function registro(payload: RegistroPayload): Promise<Usuario> {
  return apiRequest<Usuario>('/accounts/registro/', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

// CU-02: Login
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/accounts/login/', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

// CU-02: Logout
export function logout(refresh: string): Promise<{ detail: string }> {
  return apiRequest<{ detail: string }>('/accounts/logout/', {
    method: 'POST',
    body: { refresh },
  });
}

// CU-02: Me (current user)
export function me(): Promise<Usuario> {
  return apiRequest<Usuario>('/accounts/me/');
}

// CU-03: Generar test VARK
export function generarTestVARK(): Promise<VARKTestResponse> {
  return apiRequest<VARKTestResponse>('/accounts/vark/test/');
}

// CU-03: Completar test VARK
export function completarTestVARK(
  payload: CompletarTestPayload,
): Promise<CompletarTestResponse> {
  return apiRequest<CompletarTestResponse>('/accounts/vark/completar/', {
    method: 'POST',
    body: payload,
  });
}

// CU-03: Perfil VARK
export function perfilVARK(): Promise<PerfilVARK> {
  return apiRequest<PerfilVARK>('/accounts/vark/perfil/');
}
