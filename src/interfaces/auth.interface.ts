export interface AuthPersonalDetailInterface {
    firmName?: string;
    contactPerson?: string;
    mobile?: number;
    email?: string;
    customerType?: string;
}

export interface AuthKycDetailInterface {
    gstinNo?: string;
    panNo?: string;
    aadharNo?: string;
    otherNo?: string;
    otherName?: string;
}

export interface AuthLocationInterface {
    postalCode?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
}

export interface ViewAuthInfoInterface {
    firmName?: string;
    contactPerson?: string;
    mobile?: number;
    email?: string;
    customerType?: string;
    avatar? : string ;
    address? : string
}

export interface GetMobileExistInterface {
    exists?: boolean;
    setPassword?: boolean;
}