import { Docker } from 'node-docker-api'
import { Blueprint } from './App';
import * as fs from 'fs'
import { Container } from 'node-docker-api/lib/container';

export class DockerClient {
    #docker: Docker

    constructor() {
        this.#docker = new Docker({
            protocol: "https",
            host: '192.168.99.100',
            port: 2376,
            ca: fs.readFileSync('/Users/will/.docker/machine/certs/ca.pem'),
            cert: fs.readFileSync('/Users/will/.docker/machine/certs/cert.pem'),
            key: fs.readFileSync('/Users/will/.docker/machine/certs/key.pem'),
        });
    }

    deploy(blueprint: Blueprint): Promise<void> {
        return new Promise((resolve, reject) => {
            const promises: Promise<Container>[] = []
            blueprint.containers.forEach(async (container) => {
                promises.push(
                    this.#docker.container.create({
                        name: container.name, Image: `${container.image.repository}:${container.image.tag}`
                    }).then(container => container.start())
                )
            })

            Promise.all(promises).then(() => resolve()).catch(reject)
        })
    }
}