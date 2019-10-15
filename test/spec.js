const fs = require('fs');
const assert = require('assert');

describe('Conf Loader', () => {
    const loadConf = require('../lib/conf-loader');

    it('Should fail if no conf file is specified', () => {
        assert.throws( () => loadConf() );
    });

    it('Should fail if conf file is not found', () => {
        assert.throws( () => loadConf('./bla.json', /couldn't open/) );
    });

    it('Should fail if given conf type is not supported', () => {
        assert.throws( () => loadConf('./test/res/conf.xml'), /type not supported/ );
    });

    it('Should properly load a TOML file and generate an object', () => {
        let obj = loadConf('./test/res/conf.toml');
        assert.strictEqual(obj.key, 'value');
    });

    it('Should properly load an YAML file and generate an object', () => {
        let obj = loadConf('./test/res/conf.yaml');
        assert.strictEqual(obj.key, 'value');
    });

    it('Should properly load an JSON file and generate an object', () => {
        let obj = loadConf('./test/res/conf.json');
        assert.strictEqual(obj.key, 'value');
    });

    it('Should properly load an CSON file and generate an object', () => {
        let obj = loadConf('./test/res/conf.cson');
        assert.strictEqual(obj.key, 'value');
    });
});

describe('Confort', function(){
    const Confort = require('../lib/main.js');

    describe('constructor ( pathOrObject, [fileType] )', () => {

        it('Should add layers if specified', () => {
            let conf = new Confort({ key: 'value' });
            assert.strictEqual(conf.object.key, 'value');
        });

    });

    describe('::addLayer ( pathOrObject, [fileType] )', () => {

        it('Should add object layer', () => {
            let conf = new Confort();
            conf.addLayer({ key: 'value' });
            assert.strictEqual(conf.object.key, 'value');
        });

        it('Should override layer values also present in previous state', () => {
            let conf = new Confort({ key: 'value' });
            conf.addLayer({ key: 'valu3' });
            assert.strictEqual(conf.object.key, 'valu3');
        });

        it('Should preserve values not present in new layer', () => {
            let conf = new Confort({ key: 'value' });
            conf.addLayer({ newKey: 'valu3' });
            assert.strictEqual(conf.object.key, 'value');
        });

        it('Should merge objects instead of just replacing', () => {
            let conf = new Confort({ key: { a: 'b', e: [ 0 ] } });
            conf.addLayer({ key: { c: 'd', e: [ 1 ] } });
            assert.strictEqual(conf.object.key.a, 'b');
            assert.strictEqual(conf.object.key.c, 'd');
            assert.strictEqual(conf.object.key.e[0], 1);
        });

        it('Should merge objects with null prototype', () => {
            let o = Object.create(null);
            o.b = 2;
            let conf = new Confort(o);
            conf.addLayer({ a: 1 });
            assert.strictEqual(conf.object.a, 1);
            assert.strictEqual(conf.object.b, 2);
        });

        it('Should replace objects with a class other than Object', () => {
            class Foo{ constructor(){ this.a = 'foo'; } }
            let conf = new Confort({ key: { a: 'a', b: 'bar' } });
            conf.addLayer({ key: new Foo() });
            assert.strictEqual(conf.object.key.a, 'foo');
            assert.strictEqual(typeof conf.object.key.b, 'undefined');
        });

        it('Should load conf file when path is specified', () => {
            let conf = new Confort('./test/res/conf.toml');
            assert.strictEqual(conf.object.key, 'value');
        });

        it('Should record layers info', () => {
            let conf = new Confort('./test/res/conf.toml');
            conf.addLayer({ newKey: 'valu3' });
            assert.strictEqual(conf.layers[0][0], './test/res/conf.toml');
            assert.strictEqual(conf.layers[1][0].newKey, 'valu3');
            assert.strictEqual(conf.files[0], './test/res/conf.toml');
        });

        it('Should emit layer event', done => {
            let conf = new Confort('./test/res/conf.toml');
            conf.on('layer', done);
            conf.addLayer({ newKey: 'valu3' });
        });

        it('Should add new files to watch list if watching', function(done){
            fs.copyFileSync('./test/res/conf.toml', './node_modules/conf.toml');
            let conf = new Confort();
            conf.liveReload = true;
            conf.addLayer('./node_modules/conf.toml');
            conf.on('reload', () => {
                conf.liveReload = false;
                done();
            });
            fs.writeFileSync('./node_modules/conf.toml', 'key = \'value2\'');
        });

    });

    describe('::clear ( )', () => {

        it('Should remove all records and clear state', () => {
            let conf = new Confort('./test/res/conf.toml');
            conf.addLayer({ newKey: 'valu3' });
            conf.clear();
            assert.strictEqual(conf.layers.length, 0);
            assert.strictEqual(conf.files.length, 0);
            assert.strictEqual(Object.keys(conf.object).length, 0);
        });

    });

    describe('::reload ( )', () => {

        it('Should emit reload event', done => {
            let conf = new Confort('./test/res/conf.toml');
            conf.on('reload', done);
            conf.reload();
        });

        it('Should maintain state unchanged when no file changed', () => {
            let conf = new Confort('./test/res/conf.toml');
            conf.addLayer({ newKey: 'valu3' });
            conf.reload();
            assert.strictEqual(conf.layers[0][0], './test/res/conf.toml');
            assert.strictEqual(conf.layers[1][0].newKey, 'valu3');
            assert.strictEqual(conf.files[0], './test/res/conf.toml');
            assert.strictEqual(conf.object.key, 'value');
        });

        it('Should load any values changed in recorded files', () => {
            fs.copyFileSync('./test/res/conf.toml', './node_modules/conf.toml');
            let conf = new Confort('./node_modules/conf.toml');
            conf.addLayer({ newKey: 'valu3' });
            fs.writeFileSync('./node_modules/conf.toml', 'key = \'value2\'');
            conf.reload();
            assert.strictEqual(conf.object.key, 'value2');
        });

    });

    describe('::liveReload ( enabled )', () => {

        it('Should reload on conf file changes', function(done){
            fs.copyFileSync('./test/res/conf.toml', './node_modules/conf.toml');
            let conf = new Confort('./node_modules/conf.toml');
            conf.liveReload = true;
            conf.liveReload = true;
            fs.writeFileSync('./node_modules/conf.toml', 'key = \'value2\'');
            conf.on('reload', () => {
                assert.strictEqual(conf.object.key, 'value2');
                conf.liveReload = false;
                done();
            });
        });

        it('Should noop when enabling already enabled', function(){
            let conf = new Confort();
            conf.liveReload = true;
            conf.liveReload = true;
            conf.liveReload = false;
        });

    });

});
