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
    const { referral_code, new_user_id } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { 'x-client-info': 'supabase-edge-functions' } } }
    );

    // Find the referrer by their referral code
    // In a real app, you would have a `profiles` table with a `referral_code` column.
    // For this demo, we'll assume the referral code is the referrer's user ID for simplicity.
    const referrer_id = referral_code;

    // Define referral rewards
    const reward_points_referrer = 250000; // 25% of the sign-up bonus
    const reward_points_referred = 100000; // Extra bonus for the new user

    // 1. Award points to the referrer
    const { error: referrerError } = await supabaseClient.rpc('increment_points', {
      user_id: referrer_id,
      increment_amount: reward_points_referrer,
    });

    if (referrerError) {
      throw new Error(`Failed to award points to referrer: ${referrerError.message}`);
    }

    // 2. Award bonus points to the new user
    const { error: referredError } = await supabaseClient.rpc('increment_points', {
      user_id: new_user_id,
      increment_amount: reward_points_referred,
    });

    if (referredError) {
      throw new Error(`Failed to award bonus points to new user: ${referredError.message}`);
    }

    // 3. Log the referral
    const { error: referralLogError } = await supabaseClient.from('referrals').insert({
      referrer_id,
      referred_id: new_user_id,
      reward_points_referrer,
      reward_points_referred,
    });

    if (referralLogError) {
      throw new Error(`Failed to log referral: ${referralLogError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Referral applied successfully!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Referral error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
