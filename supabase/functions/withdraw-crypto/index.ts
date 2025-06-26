import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { user_id, currency, amount, crypto_address } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { 'x-client-info': 'supabase-edge-functions' } } }
    );

    // Simulate external crypto payment gateway processing
    // In a real application, you would integrate with a crypto payment API here
    // For now, we'll just simulate success and log the withdrawal
    const transaction_id = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const status = 'completed'; // Simulate instant completion

    const { data, error } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id,
        currency,
        amount,
        crypto_address,
        status,
        transaction_id,
      })
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, transaction_id, data }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
