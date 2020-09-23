var shell = require('shelljs');
var fs = require('fs');
const { Docker } = require('node-docker-api');

describe('running the application', () => {
    describe('when a config arg is not provided', () => {
        it('prints an error and exits non-zero', () => {
            const result = shell.exec('node_modules/.bin/ts-node ./src/index.ts')
            expect(result.code).toEqual(1)
            expect(result.stderr).toEqual('no config provided')
        })
    })

    it('stands up a nginx configured container', (done) => {
        expect(shell.exec('node_modules/.bin/ts-node ./src/index.ts ./tests/assets/nginx.yaml').code).toEqual(0)

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
            })
            .then((_: any) => done())
    })

    describe('when the blueprint does not pass policy checks', () => {
        fit('prints an error and exits non-zero', () => {
            const result = shell.exec('node_modules/.bin/ts-node ./src/index.ts ./tests/assets/nginx-latest.yaml')
            expect(result.code).toEqual(1)
            expect(result.stderr).toContain('container `test-nginx` with image `nginx` cannot have tag `latest`')
        })
    })
})
