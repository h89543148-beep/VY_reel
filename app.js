// ================================
// VY-REEL - MAIN APP (GLOBAL BRAIN)
// ================================

import { supabase } from './config/supabase.js';

// ================================
// 1. CHECK USER (AUTH GUARD)
// ================================
export async function checkUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error("Auth Error:", error);
            return null;
        }
        
        return user;
    } catch (err) {
        console.error("Check User Error:", err);
        return null;
    }
}

// ================================
// 2. GET USER PROFILE
// ================================
export async function getUserProfile() {
    const user = await checkUser();
    return user;
}

// ================================
// 3. LOGOUT
// ================================
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error("Logout Error:", error);
            return false;
        }
        
        // Clear Local Storage
        localStorage.clear();
        
        // Redirect to Login
        window.location.href = 'login/login.html';
        return true;
    } catch (err) {
        console.error("Logout Error:", err);
        return false;
    }
}

// ================================
// 4. GET FEED (सारी Reels लाना)
// ================================
export async function getFeed() {
    try {
        const { data, error } = await supabase
            .from('reels')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Feed Error:", error);
            return [];
        }
        
        return data;
    } catch (err) {
        console.error("Get Feed Error:", err);
        return [];
    }
}

// ================================
// 5. UPLOAD REEL
// ================================
export async function uploadReel(videoUrl, caption) {
    try {
        const user = await checkUser();
        
        if (!user) {
            alert('पहले लॉग इन करो!');
            return false;
        }
        
        const { data, error } = await supabase
            .from('reels')
            .insert({
                video_url: videoUrl,
                caption: caption,
                user_id: user.id
            });
        
        if (error) {
            console.error("Upload Error:", error);
            return false;
        }
        
        return true;
    } catch (err) {
        console.error("Upload Reel Error:", err);
        return false;
    }
}

// ================================
// 6. LIKE REEL
// ================================
export async function likeReel(reelId) {
    try {
        const user = await checkUser();
        
        if (!user) {
            alert('पहले लॉग इन करो!');
            return false;
        }
        
        // Pehle check करो कि पहले से Like तो नहीं है
        const { data: existing } = await supabase
            .from('likes')
            .select('*')
            .eq('user_id', user.id)
            .eq('reel_id', reelId)
            .single();
        
        if (existing) {
            // Unlike
            await supabase.from('likes').delete().eq('id', existing.id);
            return 'unliked';
        } else {
            // Like
            await supabase.from('likes').insert({
                user_id: user.id,
                reel_id: reelId
            });
            return 'liked';
        }
    } catch (err) {
        console.error("Like Error:", err);
        return false;
    }
}

// ================================
// 7. FORMAT DATE (हेल्पर)
// ================================
export function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) return d.toLocaleDateString('hi-IN');
    if (days > 0) return `${days} दिन पहले`;
    if (hours > 0) return `${hours} घंटे पहले`;
    if (minutes > 0) return `${minutes} मिनट पहले`;
    return 'अभी-अभी';
}

// ================================
// 8. SHOW TOAST (NOTIFICATION)
// ================================
export function showToast(message, type = 'info') {
    alert(message); // अभी Simple Alert, बाद में Proper UI बनाएंगे
}

console.log('✅ VY-Reel App.js Loaded! All Systems Ready!');
