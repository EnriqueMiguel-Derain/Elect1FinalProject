// Each required/optional quantity is the number of physical components for ONE project.
// packSize is taken from catalog item specs; packages price/consume whole retail packs.
export const CIRCUIT_PACKAGES = [
  { id:'smart-parking', name:'Smart Parking System', note:'Four ultrasonic bays with an LCD status display.', parts:[
    ['mcu-uno-ch340',1],['circ-hcsr04',4],['circ-lcd1602-i2c',1],['circ-led-assortment',4,'Red'],['circ-led-assortment',4,'Green'],['res-220',8],['circ-sg90',1],['circ-breadboard',1],['circ-jumper-mm',20],['circ-jumper-mf',10],['circ-5v-supply',1],['circ-usb-b',1],
  ]},
  { id:'plant-watering', name:'Automatic Plant Watering System', note:'Soil-moisture sensing controls a small DC pump.', parts:[
    ['mcu-uno-ch340',1],['circ-soil-capacitive',1],['circ-relay-5v',1],['circ-water-pump',1],['circ-breadboard',1],['circ-jumper-mm',15],['circ-jumper-mf',10],['circ-5v-supply',1],['circ-usb-b',1],
  ], optional:[['dio-1n4007','1N4007 diode (optional protection component)'],['trans-2n2222','2N2222 transistor (optional driver alternative)'],['res-1k','1 kΩ resistor (optional when using transistor driver)']]},
  { id:'rfid-door-lock', name:'RFID-Based Door Lock System', note:'RC522 access reader, servo latch, and LCD feedback. Includes a logic shifter for Uno-to-RC522 voltage compatibility.', parts:[
    ['mcu-uno-ch340',1],['circ-rfid-reader',1],['circ-level-shifter',1],['circ-rfid-card',2],['circ-rfid-keyfob',2],['circ-sg90',1],['circ-lcd1602-i2c',1],['circ-led-assortment',1,'Red'],['circ-led-assortment',1,'Green'],['res-220',2],['circ-buzzer',1],['circ-pushbutton',1],['res-10k',1],['circ-breadboard',1],['circ-jumper-mm',15],['circ-jumper-mf',15],['circ-5v-supply',1],['circ-usb-b',1],
  ]},
  { id:'temperature-humidity', name:'Digital Temperature and Humidity Monitor', note:'DHT11 measurements with LCD and alert indicators.', parts:[
    ['mcu-uno-ch340',1],['sen-dht11',1],['circ-lcd1602-i2c',1],['res-10k',1],['circ-buzzer',1],['circ-led-assortment',1,'Red'],['circ-led-assortment',1,'Green'],['res-220',2],['circ-pushbutton',1],['circ-breadboard',1],['circ-jumper-mm',15],['circ-jumper-mf',10],['circ-5v-supply',1],['circ-usb-b',1],
  ]},
  { id:'smart-street-light', name:'Smart Street Light System', note:'Ambient light and motion detection switch four LEDs.', parts:[
    ['mcu-uno-ch340',1],['circ-ldr-pack',1],['circ-pir-hcsr501',1],['trans-2n2222',1],['circ-led-assortment',4,'White'],['res-220',4],['res-10k',1],['res-1k',1],['circ-breadboard',1],['circ-jumper-mm',15],['circ-jumper-mf',10],['circ-5v-supply',1],['circ-usb-b',1],
  ]},
]

export function resolveCircuitParts(project, catalog, selectedOptions = []) {
  const merged = new Map()
  for (const [id, physicalQuantity, label] of project.parts) {
    const row = merged.get(id) || { id, physicalQuantity: 0, breakdown: [] }
    row.physicalQuantity += physicalQuantity
    if (label) row.breakdown.push(`${label} LED × ${physicalQuantity}`)
    merged.set(id, row)
  }
  for (const id of selectedOptions) {
    const row = merged.get(id) || { id, physicalQuantity: 0, breakdown: [] }
    row.physicalQuantity += 1
    row.breakdown.push('Optional component × 1')
    merged.set(id, row)
  }
  return [...merged.values()].map(({ id, physicalQuantity, breakdown }) => {
    const item = catalog.find((candidate) => candidate.id === id)
    if (!item) return { id, item: null, physicalQuantity: 1, packQuantity: 1 }
    const packSize = Math.max(1, Number(item.specs?.quantityInPack) || 1)
    return { id, item, physicalQuantity, breakdown, packQuantity: Math.ceil(physicalQuantity / packSize) }
  })
}
