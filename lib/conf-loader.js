
const fs = require('fs');
const path = require('path');
const assert = require('assert');

let CSON, YAML, TOML;

const libs = {
    toml: () => TOML = require('toml'),
    yaml: () => YAML = require('yaml'),
    cson: () => CSON = require('cson-parser')
};

const loaders = {
    toml: conf => TOML.parse(fs.readFileSync(conf)),
    yaml: conf => YAML.parse(fs.readFileSync(conf, 'utf8')),
    json: conf => JSON.parse(fs.readFileSync(conf, 'utf8')),
    cson: conf => CSON.parse(fs.readFileSync(conf, 'utf8'))
}

for(let ext in libs)
    try{
        libs[ext]();
    }
    catch(err){}

module.exports = function loadConf(conf){
    assert.strictEqual(typeof conf, 'string');

    let type = path.extname(conf).substr(1);

    if(typeof loaders[type] !== 'function')
        throw new Error('Conf type not supported: ' + type);

    // Attempt loading said conf file.
    try{
        return loaders[type](conf);
    }
    catch(e){
        throw new Error('Couldn\'t open conf file: ' + conf);
    }
}
