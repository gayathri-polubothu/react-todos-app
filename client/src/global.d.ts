export interface RegisterPayload {
  username: string,
  email?: string,
  password: string,
  phoneNumber?: string
}
export interface LoginPayload {
  username: string,
  password: string,
  userOwner?: string,
}

export interface TodoInterface {
  _id?: string,
  name: string,
  description: string,
  status?: boolean,
  created_at?: any,
  updated_at? : any,
  completed_at? : any,
  userOwner?: string | null,
  userID?: string | null
}
export interface AuthFormProps {
  username: string,
  password: string,
  email?: string | null,
  phoneNumber: string | null,
  setUsername: Function,
  setPassword: Function,
  setEmail: Function,
  setPhoneNumber: Function,
  label: string,
  handleSubmit: Function
}
export interface CookieStateProps {
  key: string,
  value?: string | any
}