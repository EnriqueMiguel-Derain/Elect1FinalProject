const ESSENTIAL_PARTS = [
  'cpu-r5-7600', 'cooler-amd-wraith-stealth', 'mb-msi-b650m', 'ram-kingston-16-ddr5',
  'ssd-samsung-990-1tb', 'psu-msi-a550bn', 'case-cm-elite302',
]
const NVIDIA_GAMING_PARTS = [...ESSENTIAL_PARTS, 'gpu-zotac-4060']
const RADEON_GAMING_PARTS = [
  'cpu-r5-7500f', 'cooler-amd-wraith-stealth', 'mb-msi-pro-b840m-b', 'ram-kingston-16-ddr5',
  'gpu-powercolor-rx7600', 'ssd-faspeed-p8-1tb', 'psu-deepcool-pf650', 'case-aigo-apollo-a275',
]

export const PC_PACKAGES = [
  { id:'essential-pc', name:'Essential AM5 PC', note:'Balanced everyday PC using integrated graphics; includes a monitor-free tower.', partIds:ESSENTIAL_PARTS },
  { id:'gaming-pc', name:'RTX 4060 Gaming PC', note:'AM5 tower with a dedicated NVIDIA graphics card.', partIds:NVIDIA_GAMING_PARTS, featured:true },
  { id:'amd-rx7600-pc', name:'RX 7600 Gaming PC', note:'A separate AM5 platform with PowerColor Radeon graphics.', partIds:RADEON_GAMING_PARTS },
  { id:'student-setup', name:'Student Desk Setup', note:'Everyday PC with a 120Hz monitor, compact keyboard, mouse, and speaker.', partIds:[...ESSENTIAL_PARTS,'mon-aoc-22b40hm','kb-redragon-k606','mouse-logitech-g102','spk-edifier-g200'] },
  { id:'complete-setup', name:'RTX 4060 Complete Gaming Setup', note:'Gaming tower with a 180Hz display, mechanical keyboard, mouse, and speaker.', partIds:[...NVIDIA_GAMING_PARTS,'mon-aoc-24g50f','kb-aula-f75-comic','mouse-redragon-m916','spk-edifier-g200'] },
  { id:'complete-radeon-setup', name:'RX 7600 High-Refresh Setup', note:'Radeon gaming tower paired with a 240Hz monitor and wireless gaming controls.', partIds:[...RADEON_GAMING_PARTS,'mon-viewsonic-vx2479','kb-aula-f75-comic','mouse-redragon-m916'] },
]
