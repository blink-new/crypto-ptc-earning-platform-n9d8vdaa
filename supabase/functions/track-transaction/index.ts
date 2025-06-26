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
    const { transaction_hash, currency } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { 'x-client-info': 'supabase-edge-functions' } } }
    );

    // Get withdrawal record
    const { data: withdrawal, error } = await supabaseClient
      .from('withdrawals')
      .select('*')
      .eq('transaction_hash', transaction_hash)
      .single();

    if (error || !withdrawal) {
      throw new Error('Transaction not found');
    }

    // Check blockchain confirmations
    const confirmations = await getBlockchainConfirmations(currency, transaction_hash);
    
    // Update confirmation count
    await supabaseClient
      .from('withdrawals')
      .update({
        blockchain_confirmations: confirmations
      })
      .eq('id', withdrawal.id);

    // Get required confirmations
    const { data: cryptoData } = await supabaseClient
      .from('supported_cryptos')
      .select('confirmations_required')
      .eq('symbol', currency)
      .single();

    const isConfirmed = confirmations >= (cryptoData?.confirmations_required || 1);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_hash,
        confirmations,
        required_confirmations: cryptoData?.confirmations_required || 1,
        is_confirmed: isConfirmed,
        status: withdrawal.status,
        explorer_url: getExplorerUrl(currency, transaction_hash)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Tracking error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

async function getBlockchainConfirmations(currency: string, txHash: string): Promise<number> {
  // In production, use blockchain APIs:
  // - BlockCypher API
  // - Blockchain.info API
  // - Etherscan API
  // - TronGrid API
  
  // For demonstration, simulate confirmations based on a random factor
  const maxConfirmations = 6; // Max confirmations for a transaction to be considered final
  const currentConfirmations = Math.floor(Math.random() * (maxConfirmations + 2)); // Can go slightly above max
  
  return currentConfirmations;
}

function getExplorerUrl(currency: string, txHash: string): string {
  const explorers: Record<string, string> = {
    BTC: `https://www.blockchain.com/btc/tx/${txHash}`,
    ETH: `https://etherscan.io/tx/${txHash}`,
    USDT: `https://tronscan.org/#/transaction/${txHash}`,
    TRX: `https://tronscan.org/#/transaction/${txHash}`
  };
  
  return explorers[currency] || '';
}