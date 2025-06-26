import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { user_id, currency, amount, points_deducted, crypto_address } = await req.json();

    // 1. Address Validation
    if (!isValidCryptoAddress(crypto_address, currency)) {
      throw new Error('Invalid cryptocurrency address.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { 'x-client-info': 'supabase-edge-functions' } } }
    );

    // Get crypto details
    const { data: cryptoData, error: cryptoError } = await supabaseClient
      .from('supported_cryptos')
      .select('*')
      .eq('symbol', currency)
      .eq('is_active', true)
      .single();

    if (cryptoError || !cryptoData) {
      throw new Error('Unsupported cryptocurrency');
    }

    // 2. Live Exchange Rates
    const exchangeRate = await getExchangeRate(currency);
    const usdValue = amount * exchangeRate;

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id,
        currency,
        amount,
        points_deducted,
        crypto_address,
        status: 'processing',
        network_fee: cryptoData.network_fee,
        exchange_rate: exchangeRate,
        usd_value: usdValue
      })
      .select()
      .single();

    if (withdrawalError) {
      throw new Error('Failed to create withdrawal record');
    }

    // 3. Process with NOWPayments
    try {
      const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY');
      if (!nowPaymentsApiKey) {
        throw new Error('NOWPAYMENTS_API_KEY is not set.');
      }

      const nowPaymentsResponse = await fetch('https://api.nowpayments.io/v1/payout', {
        method: 'POST',
        headers: {
          'x-api-key': nowPaymentsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: crypto_address,
          amount: amount.toFixed(8),
          currency: currency.toLowerCase(),
          ipn_callback_url: 'https://your-domain.com/api/nowpayments-webhook', // Replace with your actual webhook URL
        }),
      });

      const nowPaymentsData = await nowPaymentsResponse.json();

      if (!nowPaymentsResponse.ok) {
        throw new Error(nowPaymentsData.message || 'NOWPayments API error');
      }

      const txHash = nowPaymentsData.payout_id;

      await supabaseClient
        .from('withdrawals')
        .update({
          transaction_hash: txHash,
          status: 'completed',
          processed_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', withdrawal.id);

      return new Response(
        JSON.stringify({
          success: true,
          withdrawal_id: withdrawal.id,
          transaction_hash: txHash,
          status: 'completed',
          explorer_url: getExplorerUrl(currency, txHash)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );

    } catch (txError) {
      await supabaseClient
        .from('withdrawals')
        .update({
          status: 'failed',
          error_message: txError.message
        })
        .eq('id', withdrawal.id);

      throw txError;
    }

  } catch (error) {
    console.error('Withdrawal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

async function getExchangeRate(currency: string): Promise<number> {
  const currencyId = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    TRX: 'tron'
  }[currency];

  if (!currencyId) return 0;

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=usd`);
    const data = await response.json();
    return data[currencyId].usd;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 0; // Fallback to 0 if API fails
  }
}

function isValidCryptoAddress(address: string, currency: string): boolean {
  // Basic regex validation - not exhaustive, but a good first step
  const regexes = {
    BTC: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    USDT: /^T[A-Za-z1-9]{33}$/, // TRC20
    TRX: /^T[A-Za-z1-9]{33}$/
  };

  return regexes[currency] ? regexes[currency].test(address) : false;
}

function getExplorerUrl(currency: string, txHash: string): string {
  const explorers = {
    BTC: `https://www.blockchain.com/btc/tx/${txHash}`,
    ETH: `https://etherscan.io/tx/${txHash}`,
    USDT: `https://tronscan.org/#/transaction/${txHash}`,
    TRX: `https://tronscan.org/#/transaction/${txHash}`
  };
  
  return explorers[currency] || '';
}