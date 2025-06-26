# Real Cryptocurrency Integration Guide

## Overview
This platform is now equipped to handle real cryptocurrency transactions with live blockchain tracking. To enable actual crypto payments, you need to integrate with a payment processor.

## Supported Cryptocurrencies
- **Bitcoin (BTC)** - Bitcoin mainnet
- **Ethereum (ETH)** - Ethereum mainnet  
- **Tether (USDT)** - TRC20 on TRON network
- **TRON (TRX)** - TRON mainnet

## Integration Options

### 1. BitGo (Recommended for Enterprise)
- Multi-currency support
- Advanced security features
- Real-time webhook notifications
- API Documentation: https://www.bitgo.com/api/v2

### 2. Coinbase Commerce
- Easy integration
- Multiple cryptocurrencies
- Instant notifications
- API Documentation: https://commerce.coinbase.com/docs/

### 3. NOWPayments
- 150+ cryptocurrencies
- Auto coin conversion
- Low fees
- API Documentation: https://documenter.getpostman.com/view/7907941/2s93JusNJt

### 4. CoinGate
- Merchant tools
- Real-time exchange rates
- API Documentation: https://developer.coingate.com/

## Implementation Steps

### Step 1: Choose a Payment Processor
Select based on your needs:
- Transaction volume
- Supported countries
- Fee structure
- Technical requirements

### Step 2: Get API Credentials
1. Sign up for a merchant account
2. Complete KYC/AML verification
3. Generate API keys
4. Configure webhook endpoints

### Step 3: Update Edge Functions

Replace the mock implementation in `supabase/functions/process-withdrawal/index.ts`:

```typescript
// Example with Coinbase Commerce
async function processCryptoTransaction(
  currency: string,
  address: string,
  amount: number,
  network: string
): Promise<string> {
  const COINBASE_API_KEY = Deno.env.get('COINBASE_COMMERCE_API_KEY');
  
  const response = await fetch('https://api.commerce.coinbase.com/charges', {
    method: 'POST',
    headers: {
      'X-CC-Api-Key': COINBASE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Withdrawal',
      description: `${amount} ${currency} withdrawal`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: amount.toString(),
        currency: currency
      },
      metadata: {
        customer_address: address
      }
    })
  });
  
  const data = await response.json();
  return data.id; // Transaction ID
}
```

### Step 4: Add API Keys
Store your payment processor API keys securely:

```bash
# Add to Supabase Edge Function secrets
COINBASE_COMMERCE_API_KEY=your_api_key_here
BITGO_ACCESS_TOKEN=your_token_here
BLOCKCHAIN_API_KEY=your_key_here
```

### Step 5: Implement Blockchain Tracking

Update `supabase/functions/track-transaction/index.ts`:

```typescript
// Real blockchain confirmation tracking
async function getBlockchainConfirmations(
  currency: string, 
  txHash: string
): Promise<number> {
  switch(currency) {
    case 'BTC':
      // Use Blockchain.info API
      const btcResponse = await fetch(
        `https://blockchain.info/rawtx/${txHash}`
      );
      const btcData = await btcResponse.json();
      return btcData.block_height ? 
        (await getCurrentBlockHeight() - btcData.block_height + 1) : 0;
      
    case 'ETH':
      // Use Etherscan API
      const ethResponse = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
      );
      const ethData = await ethResponse.json();
      return ethData.result?.blockNumber ? 
        (await getCurrentEthBlock() - parseInt(ethData.result.blockNumber, 16) + 1) : 0;
      
    // Add other currencies...
  }
}
```

## Security Considerations

### 1. Hot Wallet Management
- Keep minimal funds in hot wallets
- Use multi-signature wallets
- Implement daily withdrawal limits
- Regular security audits

### 2. Address Validation
- Validate addresses before processing
- Check address format for each cryptocurrency
- Implement address whitelisting

### 3. Transaction Monitoring
- Set up real-time alerts
- Monitor for suspicious activity
- Implement fraud detection

### 4. Compliance
- KYC/AML procedures
- Transaction reporting
- Regulatory compliance

## Testing

### Testnet Configuration
For testing, use testnet endpoints:

- **Bitcoin Testnet**: https://testnet.blockchain.info
- **Ethereum Goerli**: https://goerli.etherscan.io
- **TRON Shasta**: https://shasta.tronscan.org

### Test Faucets
Get free testnet coins:
- BTC: https://coinfaucet.eu/en/btc-testnet/
- ETH: https://goerlifaucet.com/
- TRX: https://www.trongrid.io/faucet

## Monitoring & Analytics

### Transaction Metrics
- Success rate
- Average processing time
- Network fees
- Failed transactions

### User Analytics
- Withdrawal patterns
- Popular cryptocurrencies
- Geographic distribution

## Support

For production deployment assistance:
1. Review security checklist
2. Set up monitoring
3. Configure alerts
4. Test failover procedures

## Next Steps

1. Choose your payment processor
2. Complete merchant verification
3. Implement API integration
4. Test with small amounts
5. Deploy to production

Remember: Always start with testnet before moving to mainnet!