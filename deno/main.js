import * as TOML from 'https://deno.land/std@0.83.0/encoding/toml.ts'
import * as YAML from 'https://deno.land/std@0.83.0/encoding/yaml.ts'
import { extname } from 'https://deno.land/std@0.83.0/path/mod.ts'

const isMergeableObject = val =>
    Boolean(val) && typeof val === 'object' &&
        (!val.constructor || 'Object' === val.constructor.name)

function deepMerge(...subjects){

    const root = {}

    for(const obj of subjects){
        if(!isMergeableObject(obj))
            throw new Error('Cannot merge non-object')

        for(const k in obj)
            root[k] = isMergeableObject(root[k]) && isMergeableObject(obj[k])
                ? deepMerge(root[k], obj[k])
                : root[k] = obj[k]
    }

    return root
}

const loaders = {
    toml: conf => TOML.parse(conf),
    yaml: conf => YAML.parse(conf),
    json: conf => JSON.parse(conf)
}

loaders.yml = loaders.yaml

function loadConf(conf){
    const type = extname(conf).substr(1)

    if(typeof loaders[type] !== 'function')
        throw new Error('Conf type not supported: ' + type)

    return loaders[type](Deno.readTextFileSync(conf))
}

export default function (...subjects){
    subjects = subjects.map(c => typeof c == 'string' ? loadConf(c) : c)
    return deepMerge(...subjects)
}
