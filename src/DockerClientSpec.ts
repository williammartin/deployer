import { Docker } from 'node-docker-api'
import { DockerClient } from './DockerClient'
import * as fs from 'fs'

describe('Docker', () => {

    describe('Deploying', () => {

        it('creates containers from the Blueprint', (done) => {
            const blueprint = {
                containers: [
                    {
                        name: "test",
                        image: {
                            repository: "nginx",
                            tag: "latest",
                        }
                    }
                ]
            }

            const dockerClient = new DockerClient()

            dockerClient.deploy(blueprint).then(() => {
                const docker = new Docker({
                    protocol: "https",
                    host: '192.168.99.100',
                    port: 2376,
                    ca: fs.readFileSync('/Users/will/.docker/machine/certs/ca.pem'),
                    cert: fs.readFileSync('/Users/will/.docker/machine/certs/cert.pem'),
                    key: fs.readFileSync('/Users/will/.docker/machine/certs/key.pem'),
                });

                docker.container.list()
                    .then((containers: any[]) => {
                        expect(containers.length).toEqual(1)
                        containers[0].delete({ force: true })
                    }).then(() => done())
            })
        })
    })
})