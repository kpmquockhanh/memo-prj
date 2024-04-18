export type AuthRequest = {
  name: string,
  email: string,
  password: string
}

export type AuthResponse = {
  accessToken: string,
  user: User,
  // confirmToken: string,
}

export type Message = {
  _id: string,
  content: string,
  user: User,
  createdAt: string,
}

export type Attachment = {
  _id: string,
  name: string,
  src: string,
  createdBy: User,
  refId: string,
  createdAt: string,
  updatedAt: string,
  fullPath: string,
  width: number,
  height: number,
}

export type User = {
  _id: string,
  name: string,
  email: string,
  type: string,
  createdAt: string,
  updatedAt: string,
  language: string,
  platform: string,
  timezone: number,
  deviceId: string,
  gender: string,
  photoUrl: string,
}

export type UpdateUser = {
  name?: string,
  email?: string,
  language?: string,
  platform?: string,
  timezone?: number,
  deviceId?: string,
  image?: File,
}

export type ResponseUpdateUser = {
  resultCode: string,
  data?: {
    en: string,
  }
}

export type Room = {
  _id: string,
  name: string,
  description: string,
  createdBy: User,
  createdAt: string,
  updatedAt: string,
}
