export interface UserDTO {
  name: string;
  lastname: string;
  email: string;
  id: string;
  roles: E_ROLE[];

}

export interface RegisterDTO{
  name: string;
  lastname: string;
  email:string;
  password: string;
  roles: E_ROLE[];
}

export enum E_ROLE{
  MODRATOR = "r_moderator",
  STUDENT = "r_student"
}
