import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { CIRCUIT_CATALOG } from '../js/circuit-catalog.js'
import { CIRCUIT_PACKAGES, resolveCircuitParts } from '../js/circuit-packages.js'
import { PC_PACKAGES } from '../js/pc-packages.js'

const catalog = JSON.parse(await readFile(new URL('../public/data/catalog.json', import.meta.url), 'utf8'))
const allCatalogItems = [...catalog, ...CIRCUIT_CATALOG.filter((item) => !catalog.some((row) => row.id === item.id))]
const catalogById = new Map(allCatalogItems.map((item) => [item.id, item]))

test('catalog records have unique IDs, a usable price, and an image value', () => {
  assert.equal(catalogById.size, allCatalogItems.length, 'catalog IDs should be unique')
  for (const item of allCatalogItems) {
    assert.ok(item.id, 'each item needs an ID')
    assert.ok(Number.isFinite(Number(item.price)) && Number(item.price) >= 0, `${item.id} needs a non-negative price`)
    assert.ok(typeof item.image === 'string' && item.image.trim(), `${item.id} needs an image URL or path`)
  }
})

test('each circuit kit resolves all required and optional parts from the catalog', () => {
  assert.equal(CIRCUIT_PACKAGES.length, 5)
  for (const project of CIRCUIT_PACKAGES) {
    const ids = [...project.parts.map(([id]) => id), ...(project.optional || []).map(([id]) => id)]
    for (const id of ids) assert.ok(catalogById.has(id), `${project.name} references missing catalog item ${id}`)
    const resolved = resolveCircuitParts(project, allCatalogItems, (project.optional || []).map(([id]) => id))
    assert.ok(resolved.every((line) => line.item), `${project.name} should fully resolve`)
    assert.ok(resolved.every((line) => line.packQuantity >= 1), `${project.name} should use whole purchasable packs`)
  }
})

test('each PC package resolves all component IDs from the catalog', () => {
  assert.ok(PC_PACKAGES.length >= 5)
  for (const build of PC_PACKAGES) {
    for (const id of build.partIds) assert.ok(catalogById.has(id), `${build.name} references missing catalog item ${id}`)
  }
})
