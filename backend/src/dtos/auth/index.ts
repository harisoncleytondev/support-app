export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface TokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
