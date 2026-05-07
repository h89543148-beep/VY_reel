import { supabase } from '../config/supabase.js'

async function loadFeed() {
    const feedContainer = document.getElementById('feedContainer')

    // Supabase से सारी रील्स लोड करो
    const { data: reels, error } = await supabase
        .from('reels')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        feedContainer.innerHTML = `<p style="color:white;">रील्स लोड नहीं हो पाईं।</p>`
        return
    }

    if (reels.length === 0) {
        feedContainer.innerHTML = `
            <div style="color:white; text-align:center; padding:50px;">
                <p>अभी तक कोई रील नहीं है।</p>
            </div>`
        return
    }

    // हर रील के लिए HTML बनाओ
    reels.forEach(reel => {
        const card = document.createElement('div')
        card.className = 'reel-card'
        card.innerHTML = `
            <video class="reel-video" src="${reel.video_url}" loop muted playsinline></video>
            <div class="reel-info">
                <h3>@vy_user</h3>
                <p>${reel.caption || ''}</p>
            </div>
            <div class="reel-actions">
                <button>❤️ <span>0</span></button>
                <button>💬 <span>0</span></button>
                <button>↗️</button>
            </div>
        `
        feedContainer.appendChild(card)
    })

    // सारे वीडियो को ऑटोप्ले करो
    const videos = document.querySelectorAll('.reel-video')
    videos.forEach(video => {
        video.addEventListener('click', function() {
            this.paused ? this.play() : this.pause()
        })
    })

    // पहला वीडियो अपने आप चलाओ
    if (videos[0]) videos[0].play()
}

// पेज लोड होते ही फीड लोड करो
loadFeed()