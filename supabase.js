// config/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 इसके आगे अपनी असली Keys लगाना
const SUPABASE_URL = 'https://lytgdyvffohadeqyjedf.supabase.co' // अपना प्रोजेक्ट URL डालो
const SUPABASE_ANON_KEY = 'sb_publishable_jvPGqNOCw0FLphD9mJDqJA_9tYehyPH' // अपनी PUBLISHABLE KEY डालो

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)