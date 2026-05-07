import { supabase } from '../config/supabase.js'

async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        document.getElementById('displayName').innerText = user.user_metadata?.full_name || 'VY User'
        document.getElementById('userEmail').innerText = user.email
    } else {
        window.location.href = '../login/login.html'
    }
}

document.querySelector('.btn-logout').addEventListener('click', async function() {
    await supabase.auth.signOut()
    window.location.href = '../login/login.html'
})

loadProfile()