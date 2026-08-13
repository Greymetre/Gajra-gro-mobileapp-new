export interface NeftRedemptionInterface {
    redeemedpoints?: number;
    accountNo?: string;
    holderName?: string;
    bankName?: string;
    ifsc?: string;
}

export interface WalletRedemptionInterface {
    redeemedpoints?: number;
    mobile?: string;
    type?: string;
}