import { checkUser } from '../app.js';
import { supabase } from '../config/supabase.js';

document.getElementById('loginBtn').addEventListener('click', async function() {
    let email = document.getElementById('loginEmail').value.trim();
    let password = document.getElementById('loginPassword').value;
    let msgDiv = document.getElementById('loginMsg');

    if (!email || !password) {
        msgDiv.textContent = '❌ कृपया ईमेल और पासवर्ड भरें!';
        msgDiv.className = 'error';
        return;
    }

    msgDiv.textContent = '⏳ लॉग इन हो रहा है...';
    msgDiv.className = 'info';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        msgDiv.textContent = '✅ लॉग इन सफल!';
        msgDiv.className = 'success';
        
        setTimeout(() => {
            window.location.href = '../home/home.html';
        }, 1500);
        
    } catch (error) {
        msgDiv.textContent = `❌ ${error.message}`;
        msgDiv.className = 'error';
    }
});
