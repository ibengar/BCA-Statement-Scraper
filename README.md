# BCA-Statement-Scraper
Scraping Statement (Mutasi) In BCA Internet Banking

## Example Output
```json
{
  resBalance: {
    account_no: '********',
    type: 'Tabungan',
    currency: 'IDR',
    balance: '2,246,611.52'
  },
  resSettlement: [
    {
      balance: '1,164,111.52',
      date: 'PEND',
      description: 'TRSF E-BANKING CR0108/FTSCY/XXXXX        1000000.00cair              ********',
      branch: '0000',
      amount: '1,000,000.00',
      type: 'CR'
    },
    {
      balance: '2,164,111.52',
      date: 'PEND',
      description: 'BI-FAST DBTRANSFER   KE 002 ********  M-BCA',
      branch: '0000',
      amount: '1,000,000.00',
      type: 'DB'
    },
    ...
  ]
}
```
