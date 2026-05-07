import { supabase } from '../config/supabase.js'

document.getElementById('loginBtn').addEventListener('click', async function() {
    let email = document.getElementById('loginEmail').value.trim()
    let password = document.getElementById('loginPassword').value
    let msgDiv = document.getElementById('loginMsg')

    if (!email || !password) {
        msgDiv.textContent = '❌ कृपया ईमेल और पासवर्ड भरें!'
        msgDiv.className = 'error'
        return
    }

    msgDiv.textContent = '⏳ लॉग इन हो रहा है...'
    msgDiv.className = 'info'

    // असली Supabase Login
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) throw error

        // सफल लॉग इन!
        msgDiv.textContent = '✅ लॉग इन सफल! VY-Reel में तुम्हारा स्वागत है!'
        msgDiv.className = 'success'
        
        // 2 सेकंड बाद Home Page पर ले जाओ
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 2000)
        
    } catch (error) {
        msgDiv.textContent = `❌ ${error.message}`
        msgDiv.className = 'error'
    }
})