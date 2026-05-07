import { supabase } from '../config/supabase.js'

const dropZone = document.getElementById('dropZone')
const fileInput = document.getElementById('fileInput')
const previewContainer = document.getElementById('previewContainer')
const videoPreview = document.getElementById('videoPreview')
const progressContainer = document.getElementById('uploadProgress')
const progressFill = document.querySelector('.progress-fill')
const progressText = document.getElementById('progressText')
const publishBtn = document.getElementById('publishBtn')

let compressedFile = null

// 1️⃣ वीडियो चुनो — तुरंत कंप्रेशन शुरू
fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // कंप्रेशन शुरू
    progressContainer.classList.remove('hidden')
    progressText.innerText = '🎬 वीडियो कंप्रेस हो रही है...'
    progressFill.style.width = '0%'

    try {
        compressedFile = await compressVideo(file)
        progressText.innerText = '✅ कंप्रेशन पूरा!'
        progressFill.style.width = '100%'
        
        // प्रीव्यू दिखाओ
        videoPreview.src = URL.createObjectURL(compressedFile)
        previewContainer.classList.remove('hidden')
        dropZone.classList.add('hidden')
        
        // 1 सेकंड बाद प्रोग्रेस छुपाओ
        setTimeout(() => {
            progressContainer.classList.add('hidden')
        }, 1000)
    } catch (err) {
        alert('❌ कंप्रेशन फेल: ' + err.message)
        progressContainer.classList.add('hidden')
    }
}

// 2️⃣ वीडियो कंप्रेस करने का जादुई फंक्शन
async function compressVideo(file) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = URL.createObjectURL(file)

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src) // मेमोरी बचाओ
            
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // साइज़ 480p पर सेट (मोबाइल के लिए परफेक्ट)
            const maxWidth = 480
            const ratio = video.videoHeight / video.videoWidth
            canvas.width = maxWidth
            canvas.height = maxWidth * ratio

            const stream = canvas.captureStream(24) // 24 FPS
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9',
                videoBitsPerSecond: 300000 // कम बिटरेट = छोटी फ़ाइल
            })

            const chunks = []
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
            
            mediaRecorder.onstop = () => {
                const compressedBlob = new Blob(chunks, { type: 'video/webm' })
                const compressedFile = new File([compressedBlob], 'reel.webm', { type: 'video/webm' })
                
                // ट्रैक खत्म करो
                stream.getTracks().forEach(track => track.stop())
                
                resolve(compressedFile)
            }

            // वीडियो चलाओ और रिकॉर्ड करो
            video.currentTime = 0
            video.muted = true
            video.play()
            mediaRecorder.start()

            // जब वीडियो खत्म हो, रिकॉर्डिंग बंद करो
            video.onended = () => {
                mediaRecorder.stop()
                video.pause()
            }

            // सेफ्टी: 60 सेकंड बाद ज़बरदस्ती बंद करो
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop()
                    video.pause()
                }
            }, 60000)
        }

        video.onerror = () => reject(new Error('वीडियो लोड नहीं हो पाई'))
    })
}

// 3️⃣ पब्लिश बटन — Supabase पर अपलोड
publishBtn.onclick = async () => {
    const file = compressedFile || fileInput.files[0]
    const caption = document.getElementById('captionInput').value

    if (!file) return alert('❌ पहले वीडियो चुनो!')

    // अपलोड प्रोग्रेस
    progressContainer.classList.remove('hidden')
    progressText.innerText = '☁️ वीडियो अपलोड हो रही है...'
    progressFill.style.width = '0%'

    const fileName = `${Date.now()}_reel.webm`

    const { data, error } = await supabase.storage
        .from('reels')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        alert('❌ अपलोड फेल: ' + error.message)
        progressContainer.classList.add('hidden')
        return
    }

    // पब्लिक URL लो
    const publicURL = supabase.storage.from('reels').getPublicUrl(fileName).data.publicUrl

    // डेटाबेस में सेव करो
    const { error: dbError } = await supabase.from('reels').insert({
        video_url: publicURL,
        caption: caption
    })

    if (dbError) {
        alert('❌ डेटाबेस एरर: ' + dbError.message)
        return
    }

    progressText.innerText = '✅ रील तैयार है!'
    progressFill.style.width = '100%'

    setTimeout(() => {
        window.location.href = '../home/home.html'
    }, 1500)
}

dropZone.onclick = () => fileInput.click()