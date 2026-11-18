// Fallback definitions for the Circuit Builder additions.
// main.js merges these only when the deployed catalog JSON does not contain them.
export const CIRCUIT_CATALOG = [
  {
    "id": "circ-hcsr04",
    "name": "HC-SR04 Ultrasonic Distance Sensor",
    "category": "Ultrasonic Sensor",
    "price": 76,
    "summary": "40 kHz, 2–400 cm range, four-pin trigger/echo module. Parking kits use four individual sensors.",
    "specs": {
      "range": "2–400 cm",
      "frequency": "40 kHz",
      "interface": "Trigger/echo",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/ultrasonic-ranging-sensor-hc-sr04-and-bracket-for-distance-sensors-in",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-lcd1602-i2c",
    "name": "16×2 Character LCD with I²C Backpack",
    "category": "Display",
    "price": 177,
    "summary": "16-character by 2-line LCD with an I²C interface/backpack; uses fewer Arduino pins.",
    "specs": {
      "format": "16×2 characters",
      "interface": "I²C",
      "backpack": "Included",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/displays",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-sg90",
    "name": "SG90 9 g Micro Servo, 180°",
    "category": "Servo Motor",
    "price": 89,
    "summary": "Small 9 g hobby servo for position control; 180-degree class.",
    "specs": {
      "model": "SG90",
      "mass": "9 g",
      "rotation": "180° class",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/servo",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-breadboard",
    "name": "830-point Solderless Breadboard",
    "category": "Breadboard",
    "price": 77,
    "summary": "Reusable 830 tie-point solderless prototyping board, approximately 16.5 × 5.5 cm.",
    "specs": {
      "tiePoints": 830,
      "type": "Solderless",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/basic-bread-board-with-slot",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-jumper-mm",
    "name": "Male-to-Male Dupont Jumper Wires (60-pack)",
    "category": "M-M Jumper Wire",
    "price": 65,
    "summary": "Pack of 60 reusable male-to-male jumper wires in assorted lengths.",
    "specs": {
      "connector": "Male-to-male",
      "quantityInPack": 60
    },
    "sourceUrl": "https://circuit.rocks/products/arduino-jumper-cables-m-m-60-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-jumper-mf",
    "name": "Male-to-Female Dupont Jumper Wires (40-pack)",
    "category": "M-F Jumper Wire",
    "price": 65,
    "summary": "Forty male-to-female Dupont jumper wires for breadboard-to-module connections.",
    "specs": {
      "connector": "Male-to-female",
      "quantityInPack": 40
    },
    "sourceUrl": "https://docs.circuit.rocks/prototyping/jumper-wires/",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-5v-supply",
    "name": "5 V 1 A AC/DC Power Adapter",
    "category": "5V Power Supply",
    "price": 97,
    "summary": "Regulated 5 V, 1 A adapter for low-voltage project electronics; check connector and polarity before connecting.",
    "specs": {
      "outputVoltage": "5 V DC",
      "current": "1 A",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/power-supply",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-usb-b",
    "name": "USB-A to USB-B Arduino Cable, 30 cm",
    "category": "Arduino USB Cable",
    "price": 88,
    "summary": "USB-A to USB-B cable for Uno-style boards; used for programming and USB power.",
    "specs": {
      "connectors": "USB-A to USB-B",
      "length": "30 cm",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/usb-cable-type-b-to-type-a-male-for-arduino-uno-mega",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-soil-capacitive",
    "name": "Capacitive Soil Moisture Sensor",
    "category": "Moisture Sensor",
    "price": 620,
    "summary": "Corrosion-resistant capacitive moisture probe with analog output; suitable for soil moisture experiments.",
    "specs": {
      "supplyVoltage": "3.3–5.5 V",
      "output": "Analog",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/soil-moisture-sensor-corrosion-resistant",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-relay-5v",
    "name": "5 V Single-Channel Relay Module",
    "category": "Relay Module",
    "price": 55,
    "summary": "5 V relay module with optocoupler; use a separate supply for inductive loads as appropriate.",
    "specs": {
      "coilVoltage": "5 V",
      "channels": 1,
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/relay-module-channel-5v-with-optocoupler-projects-arduino-compatible",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-water-pump",
    "name": "Submersible DC Mini Water Pump, 3–6 V",
    "category": "Mini Water Pump",
    "price": 41,
    "summary": "Small magnetic-drive submersible pump. Keep it submerged; do not run dry.",
    "specs": {
      "voltage": "2.5–6 V DC",
      "current": "130–220 mA",
      "flow": "80–120 L/h",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/mini-water-pump-submersible-dc-3-6v",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "dio-1n4007",
    "name": "1N4007 Rectifier Diode (10-pack)",
    "category": "Rectifier Diode",
    "price": 45,
    "summary": "Ten general-purpose 1 A rectifier diodes, 1000 V maximum repetitive reverse voltage.",
    "specs": {
      "partNumber": "1N4007",
      "maxAverageCurrent": "1 A",
      "maxReverseVoltage": "1000 V",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/collections/discrete-devices",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-rfid-reader",
    "name": "MFRC522 RFID Reader Module, 13.56 MHz",
    "category": "RFID Reader",
    "price": 75,
    "summary": "RC522/MFRC522 SPI reader for MIFARE-compatible 13.56 MHz cards and tags. The reader uses 3.3 V logic; include a level shifter between it and the 5 V Uno R3.",
    "specs": {
      "frequency": "13.56 MHz",
      "interface": "SPI",
      "logicVoltage": "3.3 V",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/rfid-nfc",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-rfid-card",
    "name": "MIFARE Classic 1K RFID Cards (10-pack)",
    "category": "RFID Card",
    "price": 125,
    "summary": "Ten 13.56 MHz MIFARE Classic 1K cards; BOM uses individual cards.",
    "specs": {
      "frequency": "13.56 MHz",
      "memory": "1 KB",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/nfc-card-tag-13-56mhz",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-rfid-keyfob",
    "name": "MIFARE Classic 1K RFID Keyfob",
    "category": "RFID Keyfob",
    "price": 55,
    "summary": "Single passive 13.56 MHz MIFARE Classic keyfob tag.",
    "specs": {
      "frequency": "13.56 MHz",
      "memory": "1 KB",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/nfc-tag-clear-diamond-mifare-classic-13-56mhz-1k-s50",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-buzzer",
    "name": "5 V Active Buzzer Module",
    "category": "Buzzer",
    "price": 55,
    "summary": "Active buzzer module that produces a tone when powered; module includes its driver.",
    "specs": {
      "type": "Active buzzer module",
      "operatingVoltage": "3.3–5 V",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/buzzer-module",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-pushbutton",
    "name": "6 mm Tactile Push Buttons (20-pack)",
    "category": "Push Button",
    "price": 25,
    "summary": "Pack of 20 momentary tactile switches; BOM quantities count individual buttons.",
    "specs": {
      "type": "Momentary tactile",
      "size": "6 mm",
      "quantityInPack": 20
    },
    "sourceUrl": "https://circuit.rocks/collections/button-switch",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-ldr-pack",
    "name": "CdS Photoresistors (10-pack)",
    "category": "Light Sensor",
    "price": 59,
    "summary": "Ten light-dependent resistors for analog ambient-light sensing.",
    "specs": {
      "type": "CdS photoresistor",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/photo-cell-cds-photoresistor",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-pir-hcsr501",
    "name": "HC-SR501 PIR Motion Sensor Module",
    "category": "Motion Sensor",
    "price": 85,
    "summary": "Adjustable passive infrared motion detector module, digital output; supply 4.5–20 V.",
    "specs": {
      "sensor": "PIR",
      "inputVoltage": "4.5–20 V",
      "range": "3–7 m adjustable",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/pir-motion-sensor-module-digital",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-led-assortment",
    "name": "5 mm LED Assortment (25 pcs · 5 each red/green/yellow/blue/white)",
    "category": "LED Assortment",
    "price": 55,
    "summary": "Twenty-five through-hole LEDs with five pieces of each listed color; each color has about 2 V forward voltage for red/green/yellow and about 3.3 V for blue/white at 20 mA.",
    "specs": {
      "diameter": "5 mm",
      "colors": [
        "Red",
        "Green",
        "Yellow",
        "Blue",
        "White"
      ],
      "piecesPerColor": 5,
      "quantityInPack": 25,
      "forwardVoltage": "~2 V red/green/yellow; ~3.3 V blue/white at 20 mA"
    },
    "sourceUrl": "https://circuit.rocks/products/led-5mm-25pcs-red-green-yellow-blue-white",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  },
  {
    "id": "circ-level-shifter",
    "name": "TXB0104 4-Channel 3.3 V/5 V Logic Level Shifter",
    "category": "Logic Level Shifter",
    "price": 159,
    "summary": "Automatic-direction 4-channel level translator for interfacing 5 V Uno SPI signals with the 3.3 V MFRC522 reader. Connect reference supplies and grounds as specified by the board documentation.",
    "specs": {
      "channels": 4,
      "lowSide": "3.3 V",
      "highSide": "5 V",
      "type": "Bidirectional automatic-direction translator",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/bi-directional-level-shifter-txb0104",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18"
  }
]
