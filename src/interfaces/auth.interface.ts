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
    coordinates?: [number, number];
}

export interface ViewAuthInfoInterface {
    firmName?: string;
    contactPerson?: string;
    mobile?: number;
    email?: string;
    customerType?: string;
    avatar? : string ;
    address? : string
    // Mechanics only: loyalty category and what is needed for the next one
    loyaltyCategory?: { category: string | null; points?: number; activeMonths?: number; period?: string } | null;
    loyaltyGuide?: MechanicCategoryGuide;
}

export interface MechanicCategoryGuide {
    current: string | null;
    next: string | null;
    points: number;
    activeMonths: number;
    activeQuarters: number;
    period: string;
    requirements: Array<{ type: 'firstScan' | 'points' | 'everyMonth' | 'everyQuarter'; target?: number; needed?: number; done?: number }>;
}

export interface GetMobileExistInterface {
    exists?: boolean;
    setPassword?: boolean;
}