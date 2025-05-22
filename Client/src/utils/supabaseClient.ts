/*
    Creates a supabase base client. This is used to handle both login authenication 
    and a little bit of making flashcard. Authenication with a url and key is needed
    to link the database hosted by supabase.
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

