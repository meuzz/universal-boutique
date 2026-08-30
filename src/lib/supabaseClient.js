import { createClient } from "@supabase/supabase-js";

// Ces valeurs viennent de ton projet Supabase (Settings > API)
const supabaseUrl = "https://jclhumyprdqfhxvbffxo.supabase.co";
const supabaseAnonKey = "sb_publishable_gAlU1j0YJVE33YYhIrxkvQ_3cqXyEIv";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
