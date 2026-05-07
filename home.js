import { supabase } from '../config/supabase.js'

async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        // यूजर लॉग इन नहीं है → वापस Login Page पर भेजो
        window.location.href = '../login/login.html'
    } else {
        console.log('✅ VY-Reel Home: Welcome,', user.email)
    }
}

// पेज लोड होते ही चेक करो
checkUser()