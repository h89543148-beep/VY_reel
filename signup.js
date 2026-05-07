import { supabase } from '../config/supabase.js'

document.getElementById('signupBtn').addEventListener('click', async function() {
    let name = document.getElementById('signupName').value.trim()
    let email = document.getElementById('signupEmail').value.trim()
    let password = document.getElementById('signupPassword').value
    let confirm = document.getElementById('signupConfirm').value
    let msgDiv = document.getElementById('signupMsg')

    if (!name || !email || !password || !confirm) {
        msgDiv.textContent = '❌ कृपया सभी फील्ड भरें!'
        msgDiv.className = 'error'
        return
    }

    if (password.length < 6) {
        msgDiv.textContent = '❌ पासवर्ड कम से कम 6 अक्षर का होना चाहिए!'
        msgDiv.className = 'error'
        return
    }

    if (password !== confirm) {
        msgDiv.textContent = '❌ पासवर्ड मैच नहीं कर रहे!'
        msgDiv.className = 'error'
        return
    }

    msgDiv.textContent = '⏳ अकाउंट बन रहा है...'
    msgDiv.className = 'info'

    // असली Supabase Signup
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        })

        if (error) throw error

        msgDiv.textContent = '✅ अकाउंट बन गया! ईमेल चेक करो।'
        msgDiv.className = 'success'
        setTimeout(() => window.location.href = '../login/login.html', 3000)
    } catch (error) {
        msgDiv.textContent = `❌ ${error.message}`
        msgDiv.className = 'error'
    }
})