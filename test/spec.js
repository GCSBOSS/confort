const fs = require('fs');
const assert = require('assert');

const confort = require('../lib/main.js');

describe('confort', () => {

    it('Should fail merging non-object', () => {
        assert.throws(() => confort(234));
    });

    it('Should add layers if specified', () => {
        let conf = confort({ key: 'value' });
        assert.strictEqual(conf.key, 'value');
    });

    it('Should add object layer', () => {
        let conf = confort({});
        conf = confort(conf, { key: 'value' });
        assert.strictEqual(conf.key, 'value');
    });

    it('Should override layer values also present in previous state', () => {
        let conf = confort({ key: 'value' }, { key: 'valu3' });
        assert.strictEqual(conf.key, 'valu3');
    });

    it('Should preserve values not present in new layer', () => {
        let conf = confort({ key: 'value' });
        conf = confort(conf, { newKey: 'valu3' });
        assert.strictEqual(conf.key, 'value');
    });

    it('Should merge objects instead of just replacing', () => {
        let conf = confort({ key: { a: 'b', e: [ 0 ] } });
        conf = confort(conf, { key: { c: 'd', e: [ 1 ] } });
        assert.strictEqual(conf.key.a, 'b');
        assert.strictEqual(conf.key.c, 'd');
        assert.strictEqual(conf.key.e[0], 1);
    });

    it('Should merge objects with null prototype', () => {
        let o = Object.create(null);
        o.b = 2;
        let conf = confort(o);
        conf = confort(conf, { a: 1 });
        assert.strictEqual(conf.a, 1);
        assert.strictEqual(conf.b, 2);
    });

    it('Should replace objects with a class other than Object', () => {
        class Foo{ constructor(){ this.a = 'foo' } }
        let conf = confort({ key: { a: 'a', b: 'bar' } }, { key: new Foo() });
        assert.strictEqual(conf.key.a, 'foo');
        assert.strictEqual(typeof conf.key.b, 'undefined');
    });

    it('Should fail if given conf type is not supported', () => {
        assert.throws(() => confort('./conf.xml'));
    });

    it('Should fail if conf file is not found', () => {
        assert.throws(() => confort('./bla.json'));
    });

    it('Should properly load a TOML file and generate an object', () => {
        fs.writeFileSync(__dirname + '/a.toml', 'key = "value"', 'utf-8');
        let conf = confort(__dirname + '/a.toml');
        assert.strictEqual(conf.key, 'value');
        fs.unlink(__dirname + '/a.toml', Function.prototype);
    });

    it('Should properly load an YAML file and generate an object', () => {
        fs.writeFileSync(__dirname + '/a.yml', 'key: value', 'utf-8');
        let conf = confort(__dirname + '/a.yml');
        assert.strictEqual(conf.key, 'value');
        fs.unlink(__dirname + '/a.yml', Function.prototype);
    });

    it('Should properly load an JSON file and generate an object', () => {
        fs.writeFileSync(__dirname + '/a.json', '{"key": "value"}', 'utf-8');
        let conf = confort(__dirname + '/a.json');
        assert.strictEqual(conf.key, 'value');
        fs.unlink(__dirname + '/a.json', Function.prototype);
    });

});
