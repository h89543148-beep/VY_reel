import { checkUser, logout } from '../../app.js';

async function loadHome() {
    const user = await checkUser();
    
    if (!user) {
        window.location.href = '../login/login.html';
        return;
    }
    
    console.log('✅ Welcome,', user.email);
    document.getElementById('userName').textContent = user.email;
}

document.getElementById('logoutBtn')?.addEventListener('click', async function() {
    await logout();
});

loadHome();
