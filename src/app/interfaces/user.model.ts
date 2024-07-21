export interface UserDTO {
  name: string;
  lastname: string;
  email: string;
  _id: string;
  roles: E_ROLE[];
  shipmentInfo?: ShipmentInfoDTO;
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

export interface ShipmentInfoDTO {
    address: string;
    city: string;
    post_code: string;
    county: string;
}
