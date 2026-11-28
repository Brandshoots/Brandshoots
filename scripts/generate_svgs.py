import os

svg_template_before = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" fill="none">
  <defs>
    <linearGradient id="bgBefore_{id}" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#090D14"/>
      <stop offset="100%" stop-color="#05070B"/>
    </linearGradient>
    <linearGradient id="areaBefore_{id}" x1="0" y1="260" x2="0" y2="410" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#64748B" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#64748B" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="800" height="500" rx="20" fill="url(#bgBefore_{id})"/>
  <rect x="0.5" y="0.5" width="799" height="499" rx="19.5" stroke="#FFFFFF" stroke-opacity="0.08"/>

  <!-- Top Bar -->
  <rect x="32" y="28" width="128" height="26" rx="13" fill="#FFFFFF" fill-opacity="0.06" stroke="#FFFFFF" stroke-opacity="0.1"/>
  <circle cx="48" cy="41" r="4" fill="#64748B"/>
  <text x="60" y="45" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.4">BASELINE AUDIT</text>
  <text x="768" y="45" text-anchor="end" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="500">MONTH 0 · PRE-BRANDSHOOTS</text>

  <!-- Client Title -->
  <text x="32" y="92" fill="#F8FAFC" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700">{client_name} ({handle})</text>
  <text x="32" y="116" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="13">{before_subtitle}</text>

  <!-- Metric Cards -->
  <rect x="32" y="142" width="232" height="92" rx="14" fill="#0F1623" stroke="#FFFFFF" stroke-opacity="0.08"/>
  <text x="50" y="168" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">FOLLOWERS</text>
  <text x="50" y="206" fill="#E2E8F0" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="700">{followers_before}</text>
  <text x="50" y="224" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11">+1.8% monthly avg</text>

  <rect x="284" y="142" width="232" height="92" rx="14" fill="#0F1623" stroke="#FFFFFF" stroke-opacity="0.08"/>
  <text x="302" y="168" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">MONTHLY VIEWS</text>
  <text x="302" y="206" fill="#E2E8F0" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="700">{views_before}</text>
  <text x="302" y="224" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11">Mostly local impressions</text>

  <rect x="536" y="142" width="232" height="92" rx="14" fill="#0F1623" stroke="#FFFFFF" stroke-opacity="0.08"/>
  <text x="554" y="168" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">AVG RETENTION</text>
  <text x="554" y="206" fill="#E2E8F0" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="700">{retention_before}</text>
  <text x="554" y="224" fill="#64748B" font-family="Inter, system-ui, sans-serif" font-size="11">Early drop-off at 3s</text>

  <!-- Chart Container -->
  <rect x="32" y="254" width="736" height="214" rx="16" fill="#0C111B" stroke="#FFFFFF" stroke-opacity="0.06"/>
  <text x="54" y="282" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.8">30-DAY REACH TRAJECTORY</text>

  <line x1="54" y1="316" x2="744" y2="316" stroke="#FFFFFF" stroke-opacity="0.05" stroke-dasharray="4 4"/>
  <line x1="54" y1="358" x2="744" y2="358" stroke="#FFFFFF" stroke-opacity="0.05" stroke-dasharray="4 4"/>
  <line x1="54" y1="400" x2="744" y2="400" stroke="#FFFFFF" stroke-opacity="0.05" stroke-dasharray="4 4"/>
  <line x1="54" y1="436" x2="744" y2="436" stroke="#FFFFFF" stroke-opacity="0.08"/>

  <path d="M54 396 C140 398, 200 394, 280 398 C360 402, 440 392, 530 396 C610 400, 680 394, 744 396 L744 436 L54 436 Z" fill="url(#areaBefore_{id})"/>
  <path d="M54 396 C140 398, 200 394, 280 398 C360 402, 440 392, 530 396 C610 400, 680 394, 744 396" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.85"/>
</svg>'''

svg_template_after = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" fill="none">
  <defs>
    <linearGradient id="bgAfter_{id}" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#071224"/>
      <stop offset="100%" stop-color="#04070D"/>
    </linearGradient>
    <radialGradient id="glowAfter_{id}" cx="0.78" cy="0.28" r="0.6">
      <stop offset="0%" stop-color="#008CFF" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#008CFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="areaAfter_{id}" x1="0" y1="270" x2="0" y2="436" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#008CFF" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#008CFF" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="800" height="500" rx="20" fill="url(#bgAfter_{id})"/>
  <rect width="800" height="500" rx="20" fill="url(#glowAfter_{id})"/>
  <rect x="0.5" y="0.5" width="799" height="499" rx="19.5" stroke="#008CFF" stroke-opacity="0.32"/>

  <!-- Top Bar -->
  <rect x="32" y="28" width="166" height="26" rx="13" fill="#008CFF" fill-opacity="0.16" stroke="#008CFF" stroke-opacity="0.45"/>
  <circle cx="48" cy="41" r="4" fill="#008CFF"/>
  <text x="60" y="45" fill="#7CC4FF" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.4">BRANDSHOOTS SCALE</text>
  <text x="768" y="45" text-anchor="end" fill="#7CC4FF" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="600">MONTH {duration} · ACTIVE CAMPAIGN</text>

  <!-- Client Title -->
  <text x="32" y="92" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700">{client_name} ({handle})</text>
  <text x="32" y="116" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="13">{after_subtitle}</text>

  <!-- Metric Cards -->
  <rect x="32" y="142" width="232" height="92" rx="14" fill="#0B182C" stroke="#008CFF" stroke-opacity="0.28"/>
  <text x="50" y="168" fill="#7CC4FF" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">FOLLOWERS</text>
  <text x="50" y="206" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800">{followers_after}</text>
  <text x="50" y="224" fill="#38BDF8" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600">{followers_growth}</text>

  <rect x="284" y="142" width="232" height="92" rx="14" fill="#0B182C" stroke="#008CFF" stroke-opacity="0.28"/>
  <text x="302" y="168" fill="#7CC4FF" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">MONTHLY VIEWS</text>
  <text x="302" y="206" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800">{views_after}</text>
  <text x="302" y="224" fill="#38BDF8" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600">{views_growth}</text>

  <rect x="536" y="142" width="232" height="92" rx="14" fill="#0B182C" stroke="#008CFF" stroke-opacity="0.28"/>
  <text x="554" y="168" fill="#7CC4FF" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.2">CONVERSIONS</text>
  <text x="554" y="206" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800">{conv_stat}</text>
  <text x="554" y="224" fill="#38BDF8" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600">{conv_sub}</text>

  <!-- Chart Container -->
  <rect x="32" y="254" width="736" height="214" rx="16" fill="#081221" stroke="#008CFF" stroke-opacity="0.22"/>
  <text x="54" y="282" fill="#E2E8F0" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.8">COMPOUNDING REACH TRAJECTORY</text>
  <text x="744" y="282" text-anchor="end" fill="#008CFF" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700">PEAK: {views_after} VIEWS</text>

  <line x1="54" y1="316" x2="744" y2="316" stroke="#FFFFFF" stroke-opacity="0.06" stroke-dasharray="4 4"/>
  <line x1="54" y1="358" x2="744" y2="358" stroke="#FFFFFF" stroke-opacity="0.06" stroke-dasharray="4 4"/>
  <line x1="54" y1="400" x2="744" y2="400" stroke="#FFFFFF" stroke-opacity="0.06" stroke-dasharray="4 4"/>
  <line x1="54" y1="436" x2="744" y2="436" stroke="#FFFFFF" stroke-opacity="0.1"/>

  <path d="M54 424 C150 418, 220 402, 310 384 C410 364, 490 342, 580 318 C645 300, 695 292, 744 286 L744 436 L54 436 Z" fill="url(#areaAfter_{id})"/>
  <path d="M54 424 C150 418, 220 402, 310 384 C410 364, 490 342, 580 318 C645 300, 695 292, 744 286" stroke="#008CFF" stroke-width="3" stroke-linecap="round"/>
</svg>'''

clients = [
    {
        'id': 'santhi',
        'client_name': 'Santhi Pipes',
        'handle': '@santhi.pipes_rjy',
        'before_subtitle': 'Inconsistent posting cadence · Low organic reel discovery',
        'after_subtitle': 'High-velocity industrial reels · Hook-engineered product storytelling',
        'followers_before': '1.8K',
        'followers_after': '24.5K',
        'followers_growth': '+1,261% growth in 90 days',
        'views_before': '12K',
        'views_after': '250K+',
        'views_growth': '20.8x organic reach lift',
        'retention_before': '24.5%',
        'conv_stat': '+142%',
        'conv_sub': 'Direct dealer inquiries',
        'duration': '03'
    },
    {
        'id': 'viswatuff',
        'client_name': 'Viswatuff Glass',
        'handle': '@viswatuff.glass_rjy',
        'before_subtitle': 'Static factory photos · Limited architectural brand awareness',
        'after_subtitle': 'Cinematic factory showcase · Structural glass architectural reels',
        'followers_before': '1.2K',
        'followers_after': '18.4K',
        'followers_growth': '+1,433% growth in 90 days',
        'views_before': '8.5K',
        'views_after': '195K+',
        'views_growth': '22.9x organic reach lift',
        'retention_before': '21.0%',
        'conv_stat': '+118%',
        'conv_sub': 'Architectural inquiries',
        'duration': '03'
    },
    {
        'id': 'bagsworld',
        'client_name': 'Bags World',
        'handle': '@bags.world_rjy',
        'before_subtitle': 'Traditional catalog posts · Flat seasonal promotion reach',
        'after_subtitle': 'Fast-cut luxury retail visual rhythm · Viral festive hooks',
        'followers_before': '3.4K',
        'followers_after': '38.2K',
        'followers_growth': '+1,023% growth in 120 days',
        'views_before': '24K',
        'views_after': '480K+',
        'views_growth': '20.0x organic reach lift',
        'retention_before': '28.2%',
        'conv_stat': '+82%',
        'conv_sub': 'In-store retail footfall',
        'duration': '04'
    },
    {
        'id': 'aabharan',
        'client_name': 'Aabharan Jewellers',
        'handle': '@aabharan_womens_accessories',
        'before_subtitle': 'Basic showcase photos · Low bridal customer engagement',
        'after_subtitle': 'Intimate macro jewelry cinematography · Royal bridal films',
        'followers_before': '2.1K',
        'followers_after': '29.8K',
        'followers_growth': '+1,319% growth in 90 days',
        'views_before': '15K',
        'views_after': '320K+',
        'views_growth': '21.3x organic reach lift',
        'retention_before': '22.8%',
        'conv_stat': '+135%',
        'conv_sub': 'Bridal store walk-ins',
        'duration': '03'
    }
]

for c in clients:
    b_svg = svg_template_before.format(**c)
    a_svg = svg_template_after.format(**c)
    with open(f'public/results/before-analytics-{c["id"]}.svg', 'w', encoding='utf-8') as f:
        f.write(b_svg)
    with open(f'public/results/after-analytics-{c["id"]}.svg', 'w', encoding='utf-8') as f:
        f.write(a_svg)
    if os.path.exists('dist/results'):
        with open(f'dist/results/before-analytics-{c["id"]}.svg', 'w', encoding='utf-8') as f:
            f.write(b_svg)
        with open(f'dist/results/after-analytics-{c["id"]}.svg', 'w', encoding='utf-8') as f:
            f.write(a_svg)

print('Generated all 8 SVG analytics assets successfully.')
