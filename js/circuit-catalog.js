// Canonical catalog fallback. This keeps circuit and product records available when a deployed JSON catalog is stale.
export const CIRCUIT_CATALOG = [
  {
    "id": "cpu-r5-7600",
    "name": "AMD Ryzen 5 7600 (tray, no cooler)",
    "category": "PC Parts",
    "price": 8495,
    "summary": "6 cores / 12 threads · AM5 · 65W TDP; tray version does not include a cooler.",
    "specs": {
      "socket": "AM5",
      "cores": 6,
      "threads": 12,
      "tdp": 65,
      "boostGHz": 5.1
    },
    "sourceUrl": "https://www.pcworth.com/c/cpu?filters=1&stock=1",
    "sourceName": "PC Worth · current CPU listing",
    "priceCheckedAt": "2026-11-18",
    "brand": "AMD",
    "featured": true,
    "subcategory": "CPU",
    "image": "",
    "priceNote": "Current in-stock category listing showed this price; the out-of-stock product page may show an older amount."
  },
  {
    "id": "cooler-amd-wraith-stealth",
    "name": "AMD Wraith Stealth CPU Air Cooler",
    "category": "PC Parts",
    "price": 500,
    "summary": "Low-profile stock-style air cooler with pre-applied thermal paste; compatible with AM4 and AM5 sockets.",
    "specs": {
      "coolerType": "Air",
      "socketCompatibility": [
        "AM4",
        "AM5"
      ],
      "fanSizeMM": 92,
      "thermalPaste": "Pre-applied"
    },
    "sourceUrl": "https://www.pcworth.com/product/amd-wraith-stealth-cpu-air-cooler",
    "sourceName": "PC Worth · current cooler product listing",
    "priceCheckedAt": "2026-11-18",
    "brand": "AMD",
    "subcategory": "CPU Cooler",
    "image": ""
  },
  {
    "id": "mb-msi-b650m",
    "name": "MSI B650M Gaming WiFi",
    "category": "PC Parts",
    "price": 7995,
    "summary": "Micro-ATX AM5 board with DDR5 memory support and onboard Wi-Fi.",
    "specs": {
      "socket": "AM5",
      "ramType": "DDR5",
      "formFactor": "mATX",
      "chipset": "B650"
    },
    "sourceUrl": "https://www.pcworth.com/product/msi-b650m-gaming-wifi-ddr5-matx-am5",
    "sourceName": "PC Worth · MSI product listing",
    "priceCheckedAt": "2026-11-18",
    "brand": "MSI",
    "subcategory": "Motherboard",
    "image": ""
  },
  {
    "id": "ram-kingston-16-ddr5",
    "name": "Kingston 16GB DDR5-4800 UDIMM",
    "category": "PC Parts",
    "price": 3500,
    "summary": "Single 16GB desktop memory module; DDR5-4800.",
    "specs": {
      "capacityGB": 16,
      "ramType": "DDR5",
      "speedMTs": 4800,
      "formFactor": "UDIMM"
    },
    "sourceUrl": "https://www.pcworth.com/product/kingston-kvr48u40bs8-16-udimm-16gbx116gb-4800mhz-ddr5",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "Kingston",
    "featured": true,
    "subcategory": "RAM",
    "image": ""
  },
  {
    "id": "gpu-zotac-4060",
    "name": "ZOTAC GeForce RTX 4060 Twin Edge OC 8GB",
    "category": "PC Parts",
    "price": 17200,
    "summary": "8GB GDDR6 graphics card; compact dual-fan model.",
    "specs": {
      "memoryGB": 8,
      "memoryType": "GDDR6",
      "chipset": "GeForce RTX 4060"
    },
    "sourceUrl": "https://www.pcworth.com/product/geforce-rtx-4060-zotac-twin-edge-oc-8gb-gddr6-dual-fan",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "ZOTAC",
    "featured": true,
    "subcategory": "GPU",
    "image": ""
  },
  {
    "id": "ssd-samsung-990-1tb",
    "name": "Samsung 990 NVMe 1TB Gen4 SSD",
    "category": "PC Parts",
    "price": 9995,
    "summary": "1TB M.2 NVMe solid-state drive using PCIe 4.0.",
    "specs": {
      "capacityGB": 1000,
      "interface": "M.2 NVMe",
      "generation": "PCIe 4.0"
    },
    "sourceUrl": "https://www.pcworth.com/c/ssd?stock=0",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "Samsung",
    "subcategory": "Storage",
    "image": ""
  },
  {
    "id": "psu-msi-a550bn",
    "name": "MSI MAG A550BN 550W 80+ Bronze",
    "category": "PC Parts",
    "price": 2895,
    "summary": "550W ATX power supply with 80 PLUS Bronze efficiency rating.",
    "specs": {
      "wattage": 550,
      "efficiency": "80 PLUS Bronze",
      "formFactor": "ATX"
    },
    "sourceUrl": "https://www.pcworth.com/pricelist?category=PSU&sort=price_asc",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "MSI",
    "subcategory": "PSU",
    "image": ""
  },
  {
    "id": "case-cm-elite302",
    "name": "Cooler Master Elite 302 mATX Case",
    "category": "PC Parts",
    "price": 3295,
    "summary": "Micro-ATX tower case; check included fans and dimensions on retailer listing.",
    "specs": {
      "formFactor": "mATX"
    },
    "sourceUrl": "https://www.pcworth.com/pricelist?all=1&sort=name_asc",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "Cooler Master",
    "subcategory": "Case",
    "image": ""
  },
  {
    "id": "kb-aula-au75",
    "name": "AULA AU75 Beige Mechanical Keyboard",
    "category": "Peripherals",
    "price": 2595,
    "summary": "Mechanical keyboard listing; verify switch and layout options at source.",
    "specs": {},
    "sourceUrl": "https://www.pcworth.com/pricelist?all=1&sort=name_asc",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "AULA",
    "subcategory": "Keyboard",
    "image": ""
  },
  {
    "id": "mouse-aula-sc580x",
    "name": "AULA Wind SC580X Mouse",
    "category": "Peripherals",
    "price": 1045,
    "summary": "Computer mouse listing; see retailer for connection and sensor details.",
    "specs": {},
    "sourceUrl": "https://www.pcworth.com/pricelist?all=1&sort=name_asc",
    "sourceName": "PC Worth",
    "priceCheckedAt": "2026-11-18",
    "brand": "AULA",
    "subcategory": "Mouse",
    "image": ""
  },
  {
    "id": "mon-aoc-24g50f",
    "name": "AOC 24G50F 23.8-inch FHD IPS Monitor",
    "category": "Peripherals",
    "price": 4945,
    "summary": "23.8-inch Full HD IPS monitor; 144Hz native refresh, up to 180Hz overclocked.",
    "specs": {
      "panel": "IPS",
      "resolution": "1920 × 1080",
      "refreshRateHz": 144,
      "overclockedRefreshRateHz": 180,
      "sizeInches": 23.8
    },
    "sourceUrl": "https://www.pcworth.com/brands/aoc",
    "sourceName": "PC Worth · current AOC listing",
    "priceCheckedAt": "2026-11-18",
    "brand": "AOC",
    "subcategory": "Monitor",
    "image": ""
  },
  {
    "id": "mcu-uno-ch340",
    "name": "Arduino-Compatible UNO R3 CH340",
    "category": "Electronic Parts",
    "price": 255,
    "summary": "ATmega328P Uno-style development board with CH340 USB-to-serial interface and 5V logic.",
    "specs": {
      "microcontroller": "ATmega328P",
      "usbSerial": "CH340",
      "logicVoltage": "5V",
      "boardSize": "68.6 × 53.4 mm"
    },
    "sourceUrl": "https://circuit.rocks/products/arduino-uno-r3-ch340",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "featured": true,
    "subcategory": "Microcontroller",
    "image": ""
  },
  {
    "id": "mcu-esp32-ch9102",
    "name": "ESP32 Dev Board CH9102, 30-pin",
    "category": "Electronic Parts",
    "price": 440,
    "summary": "ESP32-WROOM-32 development board with Wi-Fi and Bluetooth; 3.3V logic.",
    "specs": {
      "module": "ESP32-WROOM-32",
      "usbSerial": "CH9102",
      "logicVoltage": "3.3V",
      "flashMB": 4,
      "clockMHz": 240
    },
    "sourceUrl": "https://circuit.rocks/products/esp32-dev-board-ch9102-30-pin-micro-usb",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Microcontroller",
    "image": ""
  },
  {
    "id": "mcu-nano-ch340",
    "name": "Arduino-Compatible Nano V3 CH340",
    "category": "Electronic Parts",
    "price": 227,
    "summary": "Compact ATmega328P Nano-style board with CH340 USB interface.",
    "specs": {
      "microcontroller": "ATmega328P",
      "usbSerial": "CH340",
      "logicVoltage": "5V"
    },
    "sourceUrl": "https://circuit.rocks/products/nano-ch340-usb-driver-arduino-compatible",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Microcontroller",
    "image": ""
  },
  {
    "id": "mcu-nodemcu-esp8266",
    "name": "NodeMCU V3 ESP8266 CH340",
    "category": "Electronic Parts",
    "price": 225,
    "summary": "ESP8266 Wi-Fi development board with CH340 USB interface.",
    "specs": {
      "microcontroller": "ESP8266",
      "usbSerial": "CH340",
      "wireless": "2.4 GHz Wi-Fi"
    },
    "sourceUrl": "https://circuit.rocks/collections/microcontroller",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Microcontroller",
    "image": ""
  },
  {
    "id": "mcu-mega2560",
    "name": "Arduino-Compatible Mega 2560",
    "category": "Electronic Parts",
    "price": 745,
    "summary": "ATmega2560-based board with expanded I/O for larger Arduino projects.",
    "specs": {
      "microcontroller": "ATmega2560",
      "logicVoltage": "5V",
      "digitalPins": 54,
      "analogInputs": 16
    },
    "sourceUrl": "https://circuit.rocks/collections/microcontroller",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Microcontroller",
    "image": ""
  },
  {
    "id": "sen-dht22",
    "name": "DHT22 Temperature and Humidity Sensor",
    "category": "Electronic Parts",
    "price": 109,
    "summary": "Digital temperature and relative-humidity sensor; listed accuracy ±0.5°C and ±2% RH.",
    "specs": {
      "temperatureRange": "-40 to 80 °C",
      "humidityRange": "0–100% RH",
      "temperatureAccuracy": "±0.5 °C",
      "humidityAccuracy": "±2% RH"
    },
    "sourceUrl": "https://circuit.rocks/products/dht22-temperature-and-humidity-digital-sensor",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "featured": true,
    "subcategory": "Sensor",
    "image": ""
  },
  {
    "id": "sen-dht11",
    "name": "DHT11 Temperature and Humidity Sensor",
    "category": "Electronic Parts",
    "price": 55,
    "summary": "Low-cost digital temperature and humidity module for basic monitoring.",
    "specs": {
      "temperatureRange": "0 to 50 °C",
      "humidityRange": "20–90% RH",
      "interface": "Digital"
    },
    "sourceUrl": "https://circuit.rocks/products/temperature-and-humidity-dht11-sensor",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Sensor",
    "image": ""
  },
  {
    "id": "sen-ds18b20-waterproof",
    "name": "Waterproof DS18B20 Temperature Probe, 3m",
    "category": "Electronic Parts",
    "price": 105,
    "summary": "Sealed probe using the 1-Wire digital temperature interface.",
    "specs": {
      "sensor": "DS18B20",
      "interface": "1-Wire",
      "probeLength": "3 m"
    },
    "sourceUrl": "https://circuit.rocks/products/one-wire-waterproof-temperature-sensor",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Sensor",
    "image": ""
  },
  {
    "id": "sen-ds18b20-module",
    "name": "DS18B20 Temperature Sensor Module",
    "category": "Electronic Parts",
    "price": 45,
    "summary": "Digital temperature sensor module based on DS18B20.",
    "specs": {
      "sensor": "DS18B20",
      "interface": "1-Wire"
    },
    "sourceUrl": "https://circuit.rocks/products/temperature-sensor-ds18b20-arduino",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Sensor",
    "image": ""
  },
  {
    "id": "sen-bmp180",
    "name": "BMP180 Barometric Pressure Sensor Module",
    "category": "Electronic Parts",
    "price": 42,
    "summary": "I²C pressure sensor commonly used for pressure, temperature, and estimated altitude readings.",
    "specs": {
      "sensor": "BMP180",
      "interface": "I²C",
      "measurements": "Pressure and temperature"
    },
    "sourceUrl": "https://circuit.rocks/collections/sensors-temp-humidity?page=1",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Sensor",
    "image": ""
  },
  {
    "id": "res-10k",
    "name": "10 kΩ 5% 1/4W Resistor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "Carbon-film through-hole resistors, 10 kΩ, 5% tolerance, 0.25W rating.",
    "specs": {
      "resistance": "10 kΩ",
      "tolerance": "±5%",
      "powerW": 0.25,
      "quantityInPack": 10,
      "type": "Carbon film"
    },
    "sourceUrl": "https://circuit.rocks/products/resistor-through-hole-10k-ohm-5-14w-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "featured": true,
    "subcategory": "Resistor",
    "image": ""
  },
  {
    "id": "res-220",
    "name": "220 Ω 5% 1/4W Resistor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "10 through-hole carbon-film resistors for current limiting and general circuits.",
    "specs": {
      "resistance": "220 Ω",
      "tolerance": "±5%",
      "powerW": 0.25,
      "quantityInPack": 10,
      "type": "Carbon film"
    },
    "sourceUrl": "https://circuit.rocks/collections/prototyping",
    "sourceName": "Circuitrocks · resistor pack listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Resistor",
    "image": ""
  },
  {
    "id": "res-1k",
    "name": "1 kΩ 5% 1/4W Resistor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "Through-hole carbon-film resistors, 1 kΩ, 5% tolerance, 0.25W rating.",
    "specs": {
      "resistance": "1 kΩ",
      "tolerance": "±5%",
      "powerW": 0.25,
      "quantityInPack": 10,
      "type": "Carbon film"
    },
    "sourceUrl": "https://circuit.rocks/products/resistor-through-hole-1k-ohm-5-14w-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Resistor",
    "image": ""
  },
  {
    "id": "res-470",
    "name": "470 Ω 5% 1/4W Resistor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "10 through-hole carbon-film resistors for general prototyping.",
    "specs": {
      "resistance": "470 Ω",
      "tolerance": "±5%",
      "powerW": 0.25,
      "quantityInPack": 10,
      "type": "Carbon film"
    },
    "sourceUrl": "https://circuit.rocks/collections/discrete-devices?limit=30",
    "sourceName": "Circuitrocks · 470 Ω resistor pack listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Resistor",
    "image": ""
  },
  {
    "id": "res-4k7",
    "name": "4.7 kΩ 5% 1/4W Resistor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "Through-hole carbon-film resistors, 4.7 kΩ, 5% tolerance, 0.25W rating.",
    "specs": {
      "resistance": "4.7 kΩ",
      "tolerance": "±5%",
      "powerW": 0.25,
      "quantityInPack": 10,
      "type": "Carbon film"
    },
    "sourceUrl": "https://circuit.rocks/products/resistor-through-hole-47k-ohm-5-14w-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Resistor",
    "image": ""
  },
  {
    "id": "cap-100nf",
    "name": "100 nF Ceramic Capacitor (10-pack)",
    "category": "Electronic Parts",
    "price": 75,
    "summary": "Non-polarized ceramic capacitor, marked 104, rated to 50V.",
    "specs": {
      "capacitance": "0.1 µF (100 nF)",
      "voltageRating": "50V",
      "type": "Ceramic",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/capacitors-0-1uf-ceramic-10-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "featured": true,
    "subcategory": "Capacitor",
    "image": ""
  },
  {
    "id": "cap-100uf-16",
    "name": "100 µF 16V Electrolytic Capacitor (10-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "Polarized aluminum electrolytic capacitor pack for power filtering and coupling.",
    "specs": {
      "capacitance": "100 µF",
      "voltageRating": "16V",
      "type": "Aluminum electrolytic",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/capacitors-electrolytic100uf-16v-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Capacitor",
    "image": ""
  },
  {
    "id": "cap-220uf-16",
    "name": "220 µF 16V Electrolytic Capacitor (10-pack)",
    "category": "Electronic Parts",
    "price": 25,
    "summary": "Polarized aluminum electrolytic capacitor pack.",
    "specs": {
      "capacitance": "220 µF",
      "voltageRating": "16V",
      "type": "Aluminum electrolytic",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/capacitors-electrolytic-220uf-16v-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Capacitor",
    "image": ""
  },
  {
    "id": "cap-1000uf-100",
    "name": "1000 µF 100V Electrolytic Capacitor (10-pack)",
    "category": "Electronic Parts",
    "price": 165,
    "summary": "High-capacitance polarized aluminum electrolytic capacitor pack.",
    "specs": {
      "capacitance": "1000 µF",
      "voltageRating": "100V",
      "type": "Aluminum electrolytic",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/capacitors-electrolytic-1000uf-100v-pack-of-10",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Capacitor",
    "image": ""
  },
  {
    "id": "cap-47uf-25",
    "name": "47 µF 25V Electrolytic Capacitor (10-pack)",
    "category": "Electronic Parts",
    "price": 79,
    "summary": "Polarized aluminum electrolytic capacitor pack.",
    "specs": {
      "capacitance": "47 µF",
      "voltageRating": "25V",
      "type": "Aluminum electrolytic",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/collections/components",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Capacitor",
    "image": ""
  },
  {
    "id": "dio-1n4001",
    "name": "1N4001 Rectifier Diode (10-pack)",
    "category": "Electronic Parts",
    "price": 45,
    "summary": "General-purpose silicon rectifier diode, rated 1A average forward current and 50V reverse voltage.",
    "specs": {
      "partNumber": "1N4001",
      "maxAverageCurrent": "1A",
      "maxReverseVoltage": "50V",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/diode-1n4001-10-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Diode",
    "image": ""
  },
  {
    "id": "dio-1n4148",
    "name": "1N4148 Fast Switching Signal Diode (5-pack)",
    "category": "Electronic Parts",
    "price": 25,
    "summary": "Pack of 5 small-signal silicon switching diodes for low-current circuits.",
    "specs": {
      "partNumber": "1N4148",
      "quantityInPack": 5,
      "type": "Fast switching signal diode"
    },
    "sourceUrl": "https://circuit.rocks/products/diode-1n4148-signal-10-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Diode",
    "image": ""
  },
  {
    "id": "dio-zener-5v1",
    "name": "1N4733 5.1V Zener Diode (10-pack)",
    "category": "Electronic Parts",
    "price": 52,
    "summary": "Zener diode for basic voltage-reference or clamp circuits; 1W nominal rating.",
    "specs": {
      "partNumber": "1N4733",
      "zenerVoltage": "5.1V",
      "powerW": 1,
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/collections/discrete-devices?limit=30",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Diode",
    "image": ""
  },
  {
    "id": "dio-schottky",
    "name": "PMEG2020EH Schottky Diode",
    "category": "Electronic Parts",
    "price": 9,
    "summary": "Schottky rectifier with 20V reverse-voltage and 2A current ratings.",
    "specs": {
      "partNumber": "PMEG2020EH",
      "type": "Schottky",
      "maxReverseVoltage": "20V",
      "maxCurrent": "2A"
    },
    "sourceUrl": "https://www.e-gizmo.net/gizmoshop/index.php",
    "sourceName": "e-Gizmo",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Diode",
    "image": ""
  },
  {
    "id": "dio-tvs",
    "name": "SMBJ18A TVS Diode",
    "category": "Electronic Parts",
    "price": null,
    "summary": "Transient-voltage suppressor diode for protecting circuits from voltage spikes; confirm current price with retailer.",
    "specs": {
      "partNumber": "SMBJ18A",
      "type": "TVS",
      "standoffVoltage": "18V"
    },
    "sourceUrl": "https://www.e-gizmo.net/gizmoshop/index.php",
    "sourceName": "e-Gizmo",
    "priceCheckedAt": "2026-11-18",
    "priceNote": "Confirm current price with retailer",
    "subcategory": "Diode",
    "image": ""
  },
  {
    "id": "led-5mm-mix",
    "name": "5mm LED Assortment (5 pieces)",
    "category": "Electronic Parts",
    "price": 29,
    "summary": "Through-hole 5mm indicator LEDs; colors vary by pack selection.",
    "specs": {
      "diameter": "5 mm",
      "mounting": "Through-hole",
      "quantityInPack": 5
    },
    "sourceUrl": "https://circuit.rocks/products/circuitrocks-led-5mm-diode-light-green-blue-white-yellow-red-5pcs",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "LED",
    "image": ""
  },
  {
    "id": "led-ir-940",
    "name": "5mm 940nm Infrared LED (5-pack)",
    "category": "Electronic Parts",
    "price": 35,
    "summary": "Pack of 5 infrared emitters for IR transmission or optical sensing circuits.",
    "specs": {
      "diameter": "5 mm",
      "wavelength": "940 nm",
      "type": "Infrared emitter",
      "quantityInPack": 5
    },
    "sourceUrl": "https://circuit.rocks/products/ir-receiver-diode",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "LED",
    "image": ""
  },
  {
    "id": "led-rgb-5mm",
    "name": "5mm RGB LED Common Cathode (10-pack)",
    "category": "Electronic Parts",
    "price": 55,
    "summary": "Three-color through-hole LED with common-cathode connection.",
    "specs": {
      "diameter": "5 mm",
      "type": "RGB",
      "connection": "Common cathode",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/led-5mm-rgb-clear-common-cathode-10pcs",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "LED",
    "image": ""
  },
  {
    "id": "led-3mm",
    "name": "3mm Indicator LED (5-pack)",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "Pack of 5 small through-hole indicator LEDs; check available color variant at listing.",
    "specs": {
      "diameter": "3 mm",
      "mounting": "Through-hole",
      "quantityInPack": 5
    },
    "sourceUrl": "https://circuit.rocks/collections/integrated-circuits",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "LED",
    "image": ""
  },
  {
    "id": "ic-ne555",
    "name": "NE555 Timer IC (3-pack)",
    "category": "Electronic Parts",
    "price": 35,
    "summary": "DIP-8 timer IC for monostable and astable timing circuits.",
    "specs": {
      "partNumber": "NE555",
      "package": "DIP-8",
      "quantityInPack": 3,
      "supplyVoltage": "4.5–16V"
    },
    "sourceUrl": "https://circuit.rocks/products/timer-delay-555-single-timer-3pcs-integrated-circuits",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "featured": true,
    "subcategory": "Integrated Circuit",
    "image": ""
  },
  {
    "id": "ic-lm358",
    "name": "LM358 Dual Operational Amplifier (3-pack)",
    "category": "Electronic Parts",
    "price": 69,
    "summary": "Two general-purpose op amps in one DIP-8 package; suitable for low-voltage analog circuits.",
    "specs": {
      "partNumber": "LM358",
      "package": "DIP-8",
      "amplifiers": 2,
      "quantityInPack": 3
    },
    "sourceUrl": "https://circuit.rocks/products/lm358-dual-operational-amplifiers-dip",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Integrated Circuit",
    "image": ""
  },
  {
    "id": "ic-l293d",
    "name": "L293D Dual H-Bridge Motor Driver",
    "category": "Electronic Parts",
    "price": 45,
    "summary": "Dual H-bridge driver IC for small DC motors or stepper motor windings.",
    "specs": {
      "partNumber": "L293D",
      "package": "DIP",
      "channels": 2,
      "peakOutputCurrentPerChannel": "600 mA"
    },
    "sourceUrl": "https://circuit.rocks/products/dual-h-bridge-motor-driver-for-dc-or-steppers-600ma-l293d",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Integrated Circuit",
    "image": ""
  },
  {
    "id": "ic-74hc595",
    "name": "74HC595 Shift Register (3-pack)",
    "category": "Electronic Parts",
    "price": 15,
    "summary": "8-bit serial-in, parallel-out shift register with output latch, in DIP-16 package.",
    "specs": {
      "partNumber": "74HC595",
      "package": "DIP-16",
      "bits": 8,
      "quantityInPack": 3
    },
    "sourceUrl": "https://circuit.rocks/products/74hc595-shift-register-3-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Integrated Circuit",
    "image": ""
  },
  {
    "id": "ic-ads1115",
    "name": "ADS1115 16-bit ADC Breakout",
    "category": "Electronic Parts",
    "price": 148,
    "summary": "4-channel, 16-bit ADC breakout with I²C interface; breakout board requires supply within its specified range.",
    "specs": {
      "partNumber": "ADS1115",
      "resolutionBits": 16,
      "channels": 4,
      "interface": "I²C"
    },
    "sourceUrl": "https://circuit.rocks/collections/integrated-circuits",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Integrated Circuit",
    "image": ""
  },
  {
    "id": "trans-2n2222",
    "name": "2N2222 NPN General-Purpose Transistor",
    "category": "Electronic Parts",
    "price": 15,
    "summary": "Small-signal NPN BJT for switching or low-power amplification; check package pinout before wiring.",
    "specs": {
      "partNumber": "2N2222",
      "type": "NPN BJT",
      "package": "TO-92"
    },
    "sourceUrl": "https://circuit.rocks/collections/discrete-devices?limit=30",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Transistor",
    "image": ""
  },
  {
    "id": "trans-tip32c",
    "name": "TIP32C PNP Power Transistor",
    "category": "Electronic Parts",
    "price": 15,
    "summary": "PNP silicon power transistor in TO-220 package.",
    "specs": {
      "partNumber": "TIP32C",
      "type": "PNP BJT",
      "package": "TO-220"
    },
    "sourceUrl": "https://circuit.rocks/products/tip32c-to220-tip32-to-220-transistor-tip-tip-32c-integrated-circuits",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Transistor",
    "image": ""
  },
  {
    "id": "trans-fqpf5n60c",
    "name": "FQPF5N60C N-Channel MOSFET",
    "category": "Electronic Parts",
    "price": 19,
    "summary": "N-channel power MOSFET with 600V drain-source rating; high-voltage part requires careful circuit design.",
    "specs": {
      "partNumber": "FQPF5N60C",
      "type": "N-channel MOSFET",
      "maxDrainSourceVoltage": "600V",
      "package": "TO-220F"
    },
    "sourceUrl": "https://circuit.rocks/products/mosfet-fqpf5n60c-n-dip-to-220f",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Transistor",
    "image": ""
  },
  {
    "id": "circ-hcsr04",
    "name": "HC-SR04 Ultrasonic Sensor with Bracket",
    "category": "Electronic Parts",
    "price": 25,
    "summary": "40 kHz, 2–400 cm range, four-pin trigger/echo module. Parking kits use four individual sensors.",
    "specs": {
      "range": "2–400 cm",
      "frequency": "40 kHz",
      "interface": "Trigger/echo",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/sensors-distance",
    "sourceName": "Circuitrocks · HC-SR04 with bracket listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Ultrasonic Sensor",
    "image": ""
  },
  {
    "id": "circ-lcd1602-i2c",
    "name": "16×2 Character LCD with I²C Backpack",
    "category": "Electronic Parts",
    "price": 177,
    "summary": "16-character by 2-line LCD with an I²C interface/backpack; uses fewer Arduino pins.",
    "specs": {
      "format": "16×2 characters",
      "interface": "I²C",
      "backpack": "Included",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/displays",
    "sourceName": "Circuitrocks · I2C LCD 1602 listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Display",
    "image": ""
  },
  {
    "id": "circ-sg90",
    "name": "SG90 9 g Micro Servo, 180°",
    "category": "Electronic Parts",
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
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Servo Motor",
    "image": ""
  },
  {
    "id": "circ-breadboard",
    "name": "830-point Solderless Breadboard",
    "category": "Electronic Parts",
    "price": 77,
    "summary": "Reusable 830 tie-point solderless prototyping board, approximately 16.5 × 5.5 cm.",
    "specs": {
      "tiePoints": 830,
      "type": "Solderless",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/basic-bread-board-with-slot",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Breadboard",
    "image": ""
  },
  {
    "id": "circ-jumper-mm",
    "name": "Male-to-Male Dupont Jumper Wires (60-pack)",
    "category": "Electronic Parts",
    "price": 65,
    "summary": "Pack of 60 reusable male-to-male jumper wires in assorted lengths.",
    "specs": {
      "connector": "Male-to-male",
      "quantityInPack": 60
    },
    "sourceUrl": "https://circuit.rocks/products/arduino-jumper-cables-m-m-60-pack",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "M-M Jumper Wire",
    "image": ""
  },
  {
    "id": "circ-jumper-mf",
    "name": "Male-to-Female Dupont Jumper Wires (20-pack)",
    "category": "Electronic Parts",
    "price": 35,
    "summary": "Pack of 20 male-to-female wires; choose 10 cm, 20 cm, or 30 cm length.",
    "specs": {
      "connector": "Male-to-female",
      "quantityInPack": 20,
      "availableLengths": "10 cm, 20 cm, 30 cm"
    },
    "sourceUrl": "https://circuit.rocks/products/jumper-wires-dupont-line-10-20-30-cm-arduino-compatible",
    "sourceName": "Circuitrocks · M-F jumper wire listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "M-F Jumper Wire",
    "image": "",
    "priceNote": "Current exact pack price is not published on the linked reference; confirm before purchase."
  },
  {
    "id": "circ-5v-supply",
    "name": "5 V 1 A AC/DC Power Adapter",
    "category": "Electronic Parts",
    "price": 97,
    "summary": "Regulated 5 V, 1 A adapter for low-voltage project electronics; check connector and polarity before connecting.",
    "specs": {
      "outputVoltage": "5 V DC",
      "current": "1 A",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/power-supply",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "5V Power Supply",
    "image": ""
  },
  {
    "id": "circ-usb-b",
    "name": "USB-A to USB-B Arduino Cable, 30 cm",
    "category": "Electronic Parts",
    "price": 49,
    "summary": "USB-A to USB-B cable for Uno-style boards; used for programming and USB power.",
    "specs": {
      "connectors": "USB-A to USB-B",
      "length": "30 cm",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/collections/usb-cables-adapters",
    "sourceName": "Circuitrocks · USB cable listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Arduino USB Cable",
    "image": ""
  },
  {
    "id": "circ-soil-capacitive",
    "name": "Capacitive Soil Moisture Sensor",
    "category": "Electronic Parts",
    "price": 620,
    "summary": "Corrosion-resistant capacitive moisture probe with analog output; suitable for soil moisture experiments.",
    "specs": {
      "supplyVoltage": "3.3–5.5 V",
      "output": "Analog",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/soil-moisture-sensor-corrosion-resistant",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Moisture Sensor",
    "image": ""
  },
  {
    "id": "circ-relay-5v",
    "name": "5 V Single-Channel Relay Module",
    "category": "Electronic Parts",
    "price": 55,
    "summary": "5 V relay module with optocoupler; use a separate supply for inductive loads as appropriate.",
    "specs": {
      "coilVoltage": "5 V",
      "channels": 1,
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/relay-module-channel-5v-with-optocoupler-projects-arduino-compatible",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Relay Module",
    "image": ""
  },
  {
    "id": "circ-water-pump",
    "name": "Submersible DC Mini Water Pump, 3–6 V",
    "category": "Electronic Parts",
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
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Mini Water Pump",
    "image": ""
  },
  {
    "id": "dio-1n4007",
    "name": "1N4007 Rectifier Diode (10-pack)",
    "category": "Electronic Parts",
    "price": 83.23,
    "summary": "Ten general-purpose 1 A rectifier diodes, 1000 V maximum repetitive reverse voltage.",
    "specs": {
      "partNumber": "1N4007",
      "maxAverageCurrent": "1 A",
      "maxReverseVoltage": "1000 V",
      "quantityInPack": 10
    },
    "sourceUrl": "https://www.digikey.ph/en/products/detail/dcomponents/1N4007/15854329",
    "sourceName": "DigiKey Philippines · 1N4007, 10 pieces",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Rectifier Diode",
    "image": "",
    "priceNote": "10-piece price shown; shipping and stock may change."
  },
  {
    "id": "circ-rfid-reader",
    "name": "MFRC522 RFID Reader Module, 13.56 MHz",
    "category": "Electronic Parts",
    "price": 65,
    "summary": "RC522/MFRC522 SPI reader for MIFARE-compatible 13.56 MHz cards and tags. The reader uses 3.3 V logic; include a level shifter between it and the 5 V Uno R3.",
    "specs": {
      "frequency": "13.56 MHz",
      "interface": "SPI",
      "logicVoltage": "3.3 V",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/nfc-rfid-reader-kit-13-56mh",
    "sourceName": "Circuitrocks · MFRC522 listing",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "RFID Reader",
    "image": ""
  },
  {
    "id": "circ-rfid-card",
    "name": "MIFARE Classic 1K RFID Cards (10-pack)",
    "category": "Electronic Parts",
    "price": 125,
    "summary": "Ten 13.56 MHz MIFARE Classic 1K cards; BOM uses individual cards.",
    "specs": {
      "frequency": "13.56 MHz",
      "memory": "1 KB",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/nfc-card-tag-13-56mhz",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "RFID Card",
    "image": ""
  },
  {
    "id": "circ-rfid-keyfob",
    "name": "MIFARE Classic 1K RFID Keyfob",
    "category": "Electronic Parts",
    "price": 55,
    "summary": "Single passive 13.56 MHz MIFARE Classic keyfob tag.",
    "specs": {
      "frequency": "13.56 MHz",
      "memory": "1 KB",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/nfc-tag-clear-diamond-mifare-classic-13-56mhz-1k-s50",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "RFID Keyfob",
    "image": ""
  },
  {
    "id": "circ-buzzer",
    "name": "5 V Active Buzzer Module",
    "category": "Electronic Parts",
    "price": 55,
    "summary": "Active buzzer module that produces a tone when powered; module includes its driver.",
    "specs": {
      "type": "Active buzzer module",
      "operatingVoltage": "3.3–5 V",
      "quantityInPack": 1
    },
    "sourceUrl": "https://circuit.rocks/products/buzzer-module",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Buzzer",
    "image": ""
  },
  {
    "id": "circ-pushbutton",
    "name": "6 mm Tactile Push Buttons (20-pack)",
    "category": "Electronic Parts",
    "price": 25,
    "summary": "Pack of 20 momentary tactile switches; BOM quantities count individual buttons.",
    "specs": {
      "type": "Momentary tactile",
      "size": "6 mm",
      "quantityInPack": 20
    },
    "sourceUrl": "https://circuit.rocks/collections/button-switch",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Push Button",
    "image": ""
  },
  {
    "id": "circ-ldr-pack",
    "name": "CdS Photoresistors (10-pack)",
    "category": "Electronic Parts",
    "price": 59,
    "summary": "Ten light-dependent resistors for analog ambient-light sensing.",
    "specs": {
      "type": "CdS photoresistor",
      "quantityInPack": 10
    },
    "sourceUrl": "https://circuit.rocks/products/photo-cell-cds-photoresistor",
    "sourceName": "Circuitrocks",
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Light Sensor",
    "image": ""
  },
  {
    "id": "circ-pir-hcsr501",
    "name": "HC-SR501 PIR Motion Sensor Module",
    "category": "Electronic Parts",
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
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Motion Sensor",
    "image": ""
  },
  {
    "id": "circ-led-assortment",
    "name": "5 mm LED Assortment (25 pcs · 5 each red/green/yellow/blue/white)",
    "category": "Electronic Parts",
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
    "priceCheckedAt": "2026-11-18",
    "subcategory": "LED Assortment",
    "image": ""
  },
  {
    "id": "circ-level-shifter",
    "name": "TXB0104 4-Channel 3.3 V/5 V Logic Level Shifter",
    "category": "Electronic Parts",
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
    "priceCheckedAt": "2026-11-18",
    "subcategory": "Logic Level Shifter",
    "image": ""
  }
]
