const ESSENTIAL_PARTS = [
  'cpu-r5-7600', 'mb-msi-b650m', 'ram-kingston-16-ddr5',
  'ssd-samsung-990-1tb', 'psu-msi-a550bn', 'case-cm-elite302',
]

const GAMING_PARTS = [...ESSENTIAL_PARTS, 'gpu-zotac-4060']
const PERIPHERALS = ['mon-aoc-24g50f', 'kb-aula-au75', 'mouse-aula-sc580x']

export const PC_PACKAGES = [
  {
    id: 'essential-pc',
    name: 'Essential PC',
    note: 'Core PC components · no discrete graphics card',
    partIds: ESSENTIAL_PARTS,
  },
  {
    id: 'gaming-pc',
    name: 'Gaming PC',
    note: 'Core components with a dedicated graphics card',
    partIds: GAMING_PARTS,
    featured: true,
  },
  {
    id: 'complete-setup',
    name: 'Complete Gaming Setup',
    note: 'Gaming PC plus monitor, keyboard, and mouse',
    partIds: [...GAMING_PARTS, ...PERIPHERALS],
  },
]
