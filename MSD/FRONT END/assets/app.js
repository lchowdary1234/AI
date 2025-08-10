// Helpers
const $ = (sel, el = document) => el.querySelector(sel)
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel))

// Theme toggle
const themeBtn = $('#themeToggle')
const root = document.documentElement
const savedTheme = localStorage.getItem('theme')
if (savedTheme) root.setAttribute('data-theme', savedTheme)
themeBtn?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
  root.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  themeBtn.setAttribute('aria-pressed', String(next !== 'light'))
})

// Year
$('#year').textContent = new Date().getFullYear()

// Nav active state on scroll
const sections = $$('main .section')
const links = $$('.nav-link')
const setActive = () => {
  let idx = 0
  const offset = 120
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect()
    if (rect.top - offset < 0) idx = i
  })
  links.forEach(l => l.classList.remove('active'))
  const id = sections[idx]?.id
  if (id) {
    const current = links.find(l => l.getAttribute('href') === `#${id}`)
    current?.classList.add('active')
  // --- Login Page Logic ---
  const loginContainer = document.getElementById('loginContainer');
  const mainApp = document.getElementById('mainApp');
  const loginFormPage = document.getElementById('loginFormPage');
  if (loginFormPage && loginContainer && mainApp) {
    loginFormPage.addEventListener('submit', (e) => {
      e.preventDefault();
      // Demo: accept any non-empty user/pass, or user/pass
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value.trim();
      if ((user && pass) && (user === 'user' && pass === 'pass')) {
        loginContainer.style.opacity = '1';
        loginContainer.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1)';
        loginContainer.style.opacity = '0';
        setTimeout(() => {
          loginContainer.style.display = 'none';
          mainApp.style.display = '';
          mainApp.style.animation = 'fadeIn 1.2s cubic-bezier(.4,0,.2,1)';
        }, 700);
      } else {
        loginFormPage.classList.add('shake');
        setTimeout(() => loginFormPage.classList.remove('shake'), 500);
      }
    });
  }

  // Add shake animation for login error
  const style = document.createElement('style');
  style.innerHTML = `
    .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake {
      10%, 90% { transform: translateX(-2px); }
      20%, 80% { transform: translateX(4px); }
      30%, 50%, 70% { transform: translateX(-8px); }
      40%, 60% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
  }
}
document.addEventListener('scroll', setActive, { passive: true })
setActive()

// Sidebar collapse (visual demo)
$('.sidebar-toggle')?.addEventListener('click', () => {
  const app = $('.app')
  // Toggle narrow/wide sidebar by switching grid column
  if (getComputedStyle(app).gridTemplateColumns.startsWith('280px')) {
    app.style.gridTemplateColumns = '72px 1fr'
  } else {
    app.style.gridTemplateColumns = ''
  }
})

// Heatmap mock (12 columns x ~14 rows)
const heatmap = $('#heatmap')
if (heatmap) {
  const cols = 12, rows = 7
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = Math.floor(Math.random() * 4) // 0..3
      const cell = document.createElement('div')
      cell.className = `cell c-${v}`
      cell.title = `Week ${r + 1}, Mins bucket: ${v}`
      heatmap.appendChild(cell)
    }
  }
}

// Canvas chart placeholder
const chart = $('#timeChart')
if (chart && chart.getContext) {
  const ctx = chart.getContext('2d')
  const data = [
    { label: 'NLP', val: 140, color: '#10b981' },
    { label: 'CV', val: 90, color: '#17804f' },
    { label: 'ML', val: 120, color: '#22c55e' },
    { label: 'DL', val: 160, color: '#16a34a' },
    { label: 'RL', val: 40, color: '#14532d' },
  ]
  const w = chart.width, h = chart.height
  const pad = 24, bw = (w - pad * 2) / data.length - 10
  const max = Math.max(...data.map(d => d.val)) || 1
  ctx.clearRect(0, 0, w, h)
  ctx.font = '12px system-ui'
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
  ctx.textAlign = 'center'
  data.forEach((d, i) => {
    const x = pad + i * (bw + 10)
    const bh = Math.round((d.val / max) * (h - pad * 2))
    const y = h - pad - bh
    ctx.fillStyle = d.color
    ctx.fillRect(x, y, bw, bh)
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.fillText(d.label, x + bw / 2, h - 6)
  })
}

// File upload drag & drop
const dropZone = $('#dropZone')
const fileInput = $('#fileInput')
if (dropZone && fileInput) {
  const prevent = e => { e.preventDefault(); e.stopPropagation() }
  ;['dragenter','dragover','dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, prevent))
  ;['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('dragover')))
  ;['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover')))
  dropZone.addEventListener('drop', e => {
    const dt = e.dataTransfer
    if (dt?.files?.length) {
      fileInput.files = dt.files
    }
  })
}

// Voice to text (if available)
const voiceBtn = $('#voiceBtn')
const voiceStatus = $('#voiceStatus')
let recognizing = false
let recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SR()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = true

  recognition.onstart = () => {
    recognizing = true
    voiceBtn.setAttribute('aria-pressed', 'true')
    voiceStatus.textContent = 'Listening...'
  }
  recognition.onend = () => {
    recognizing = false
    voiceBtn.setAttribute('aria-pressed', 'false')
    voiceStatus.textContent = 'Stopped.'
  }
  recognition.onerror = () => {
    recognizing = false
    voiceStatus.textContent = 'Speech recognition error.'
  }
  recognition.onresult = (e) => {
    let transcript = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript
    }
    const ta = $('#topics')
    ta.value = (ta.value + ' ' + transcript).trim()
  }

  voiceBtn?.addEventListener('click', () => {
    if (!recognizing) recognition.start()
    else recognition.stop()
  })
} else {
  voiceBtn?.setAttribute('disabled', 'true')
  voiceStatus.textContent = 'Speech recognition not supported in this browser.'
}

// Log form (demo append to timeline)
$('#logForm')?.addEventListener('submit', (e) => {
  e.preventDefault()
  const date = $('#date').value || new Date().toISOString().slice(0,10)
  const topics = $('#topics').value.trim()
  const time = parseInt($('#time').value || '0', 10)
  const difficulty = $('#difficulty').selectedOptions[0].text
  const mood = $('#mood').selectedOptions[0].text

  if (!topics || !time) return

  const li = document.createElement('li')
  li.innerHTML = `
    <div class="tl-date">${new Date(date).toLocaleString(undefined,{ month:'short', day:'numeric'})}</div>
    <div class="tl-body">
      <div class="tl-title"></div>
      <div class="tl-meta"></div>
    </div>`
  li.querySelector('.tl-title').textContent = topics.slice(0, 60) + (topics.length > 60 ? '…' : '')
  li.querySelector('.tl-meta').textContent = `Time: ${time}m • Diff: ${difficulty} • Mood: ${mood}`
  $('#timeline')?.prepend(li)

  // Basic streak demo
  const sEl = $('#streakDays')
  sEl.textContent = String(Number(sEl.textContent || '0') + 1)

  e.target.reset()
})

// Chat stub
$('#chatForm')?.addEventListener('submit', (e) => {
  e.preventDefault()
  const input = $('#chatText')
  const txt = input.value.trim()
  if (!txt) return
  const log = $('#chatLog')

  const addMsg = (role, text) => {
    const wrap = document.createElement('div')
    wrap.className = `msg ${role}`
    const bubble = document.createElement('div')
    bubble.className = 'msg-bubble'
    bubble.textContent = text
    wrap.appendChild(bubble)
    log.appendChild(wrap)
    log.scrollTop = log.scrollHeight
  }

  addMsg('user', txt)
  input.value = ''
  setTimeout(() => {
    addMsg('bot', 'This is a layout-only demo. Connect an AI backend to generate personalized guidance.')
  }, 500)
})

// Report export
$('#exportHtml')?.addEventListener('click', () => {
  const html = `<!doctype html><meta charset="utf-8"><title>AI Career Tracker Export</title><pre>${encodeHTML(document.querySelector('main')?.innerText || '')}</pre>`
  const blob = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'ai-career-tracker.html'
  a.click()
})
$('#exportPdf')?.addEventListener('click', () => window.print())

// Share link toggle
$('#shareToggle')?.addEventListener('change', (e) => {
  const checked = e.target.checked
  const link = $('#shareLink')
  const copy = $('#copyLink')
  if (checked) {
    const url = `${location.origin}${location.pathname}?share=${Math.random().toString(36).slice(2)}`
    link.value = url
    copy.disabled = false
  } else {
    link.value = '(disabled)'
    copy.disabled = true
  }
})
$('#copyLink')?.addEventListener('click', async () => {
  const link = $('#shareLink').value
  try {
    await navigator.clipboard.writeText(link)
    alert('Link copied!')
  } catch {
    alert('Copy failed. Select and copy manually.')
  }
})

// Privacy: export and delete (demo only)
$('#exportJson')?.addEventListener('click', () => {
  const demo = { logs: [], skills: [], generatedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(demo, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'ai-career-tracker.json'
  a.click()
})
$('#deleteAll')?.addEventListener('click', () => {
  if (confirm('Delete all local data? This cannot be undone.')) {
    // Add localStorage clearing here if you persist anything later
    alert('All local data deleted (demo).')
  }
})

// Expand all sections
$('#expandAll')?.addEventListener('click', () => {
  // This layout has no collapsible panels; keep as placeholder for future.
  alert('Nothing to expand yet. Add collapsible groups later.')
})

// Utilities
function encodeHTML(s) {
  return s.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]))
}