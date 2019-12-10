export type TransactionType = 'PROMOTION' | 'FEE' | 'TRIP_BOOKING' | 'REFUND';

export interface Transaction {
    id: number;
    date: string;
    transactionType: TransactionType;
    amount: number;
}

export interface AccountInfo {
    balance: number;
    transactions: Transaction[];
}
