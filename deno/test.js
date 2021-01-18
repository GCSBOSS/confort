import { assertEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'

import confort from './main.js'

Deno.test('Should fail merging non-object', () => {
    assertThrows( () => confort(234) )
})

Deno.test('Should add layers if specified', () => {
    let conf = confort({ key: 'value' })
    assertEquals(conf.key, 'value')
})

Deno.test('Should add object layer', () => {
    let conf = confort({})
    conf = confort(conf, { key: 'value' })
    assertEquals(conf.key, 'value')
})

Deno.test('Should override layer values also present in previous state', () => {
    let conf = confort({ key: 'value' }, { key: 'valu3' })
    assertEquals(conf.key, 'valu3')
})

Deno.test('Should preserve values not present in new layer', () => {
    let conf = confort({ key: 'value' })
    conf = confort(conf, { newKey: 'valu3' })
    assertEquals(conf.key, 'value')
})

Deno.test('Should merge objects instead of just replacing', () => {
    let conf = confort({ key: { a: 'b', e: [ 0 ] } })
    conf = confort(conf, { key: { c: 'd', e: [ 1 ] } })
    assertEquals(conf.key.a, 'b')
    assertEquals(conf.key.c, 'd')
    assertEquals(conf.key.e[0], 1)
})

Deno.test('Should merge objects with null prototype', () => {
    let o = Object.create(null)
    o.b = 2
    let conf = confort(o)
    conf = confort(conf, { a: 1 })
    assertEquals(conf.a, 1)
    assertEquals(conf.b, 2)
})

Deno.test('Should replace objects with a class other than Object', () => {
    class Foo{ constructor(){ this.a = 'foo' } }
    let conf = confort({ key: { a: 'a', b: 'bar' } }, { key: new Foo() })
    assertEquals(conf.key.a, 'foo')
    assertEquals(typeof conf.key.b, 'undefined')
})

Deno.test('Should fail if given conf type is not supported', () => {
    assertThrows( () => confort('./conf.xml') )
})

Deno.test('Should fail if conf file is not found', () => {
    assertThrows( () => confort('./bla.json') )
})

Deno.test('Should properly load a TOML file and generate an object', async () => {
    let cf = await Deno.makeTempFile({ dir: Deno.cwd(), suffix: '.toml' })
    await Deno.writeTextFile(cf, 'key = "value"')
    let conf = confort(cf)
    assertEquals(conf.key, 'value')
    await Deno.remove(cf)
})

Deno.test('Should properly load an YAML file and generate an object', async () => {
    let cf = await Deno.makeTempFile({ dir: Deno.cwd(), suffix: '.yml' })
    await Deno.writeTextFile(cf, 'key: value')
    let conf = confort(cf)
    assertEquals(conf.key, 'value')
    await Deno.remove(cf)
})

Deno.test('Should properly load an JSON file and generate an object', async () => {
    let cf = await Deno.makeTempFile({ dir: Deno.cwd(), suffix: '.json' })
    await Deno.writeTextFile(cf, '{"key": "value"}')
    let conf = confort(cf)
    assertEquals(conf.key, 'value')
    await Deno.remove(cf)
})
