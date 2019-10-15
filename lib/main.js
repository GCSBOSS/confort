const fs = require('fs');
const assert = require('assert');
const deepmerge = require('deepmerge');
const EventEmitter = require('events');
const loadConf = require('./conf-loader');

function createWatches(files, cb){
    return files.map( f =>
        fs.watch(f, { persistent: false }, op =>
            op == 'change' && cb() ) );
}

function setupWatches(){
    for(let w of this.watchers)
        w.close();
    this.watchers = [];

    if(this.shouldReload)
        this.watchers = createWatches(this.files, () => this.reload());
}

const isMergeableObject = val =>
    val && typeof val === 'object' &&
        (!val.constructor || ['Object', 'Array'].includes(val.constructor.name));

module.exports = class Confort extends EventEmitter {

    constructor(firstLayer, type){
        super();
        this.object = {};
        this.layers = [];
        this.files = [];
        this.watchers = [];

        this.shouldReload = false;

        if(firstLayer)
            this.addLayer(firstLayer, type);
    }

    addLayer(pathOrObject, fileType){
        this.layers.push([pathOrObject, fileType]);

        if(typeof pathOrObject == 'string'){
            this.files.push(pathOrObject);
            pathOrObject = loadConf(pathOrObject, fileType);
        }

        assert.strictEqual(typeof pathOrObject, 'object');

        this.object = deepmerge(this.object, pathOrObject, {
            arrayMerge: (a, b) => b,
            isMergeableObject
        });

        setupWatches.bind(this)();

        this.emit('layer');
    }

    reload(){
        let layers = this.layers;
        this.clear();
        layers.forEach(l => this.addLayer(...l));
        this.emit('reload');
    }

    set liveReload(enabled){

        enabled = Boolean(enabled);
        if(enabled == this.shouldReload)
            return;

        this.shouldReload = enabled;
        setupWatches.bind(this)();
    }

    clear(){
        this.object = {};
        this.layers = [];
        this.files = [];
    }
}
