// Dashboard demo JS: Animations and chart placeholders
window.addEventListener('DOMContentLoaded', () => {
  // Animate widgets
  document.querySelectorAll('.animated').forEach(el => {
    setTimeout(() => el.classList.add('fadeInUp'),
      parseFloat(getComputedStyle(el).getPropertyValue('--delay') || 0) * 1000);
  });

  // Timeline chart demo
  const timeline = document.getElementById('timelineChart');
  if (timeline && timeline.getContext) {
    const ctx = timeline.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.fillText('Timeline Chart (Demo)', 80, 60);
  }
  // Domain chart demo
  const domain = document.getElementById('domainChart');
  if (domain && domain.getContext) {
    const ctx = domain.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.fillText('Domain Chart (Demo)', 80, 60);
  }
  // Heatmap demo
  const heatmap = document.getElementById('heatmap');
  if (heatmap) {
    for (let i = 0; i < 36; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell c-' + (i % 4);
      cell.style.display = 'inline-block';
      cell.style.margin = '2px';
      cell.style.width = '16px';
      cell.style.height = '16px';
      heatmap.appendChild(cell);
    }
  }
});
