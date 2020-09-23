import * as fs from 'fs'
import * as yaml from 'yaml'
import { Blueprint } from './App'

export class FileLoader {
    #filename: string

    constructor(filename: string) {
        this.#filename = filename
    }

    load(): Promise<Blueprint> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.#filename, 'utf-8', (err: NodeJS.ErrnoException, data: string) => {
                if (!err) {
                    try {
                        const yamlContent = yaml.parse(data) as Blueprint
                        resolve(yamlContent)
                    } catch (ignored) {
                        reject(new Error('blueprint yaml is malformed'))
                    }
                } else {
                    reject(err)
                }
            })
        })
    }
}
