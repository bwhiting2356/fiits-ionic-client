import { AccountInfo } from 'src/app/shared/account-info.model';

export const mockAccountInfo: AccountInfo = {
    balance: -5.08,
    transactions: [
        {
            id: 8,
            date: '2019-12-31T23:38:24.000+0000',
            transactionType: 'PROMOTION',
            amount: 10
        },
        {
            id: 9,
            date: '2019-12-31T23:48:24.000+0000',
            transactionType: 'PROMOTION',
            amount: 5
        },
        {
            id: 10,
            date: '2019-12-31T23:58:24.000+0000',
            transactionType: 'PROMOTION',
            amount: -4
        },
        {
            id: 7,
            date: '2019-12-01T21:00:31.480+0000',
            transactionType: 'TRIP_BOOKING',
            amount: -2.4
        }
    ]
};
