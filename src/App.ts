interface BlueprintLoader {
    load(): Promise<Blueprint>
}

interface PolicyEnforcer {
    check(blueprint: Blueprint): string[]
}

interface Deployer {
    deploy(blueprint: Blueprint): void
}

export type Image = {
    repository: string,
    tag: string,
}

export type Container = {
    name: string,
    image: Image,
}

export type Blueprint = {
    containers: Container[]
}

export class App {
    #blueprintLoader: BlueprintLoader
    #deployer: Deployer
    #policyEnforcer: PolicyEnforcer

    constructor(blueprintLoader: BlueprintLoader, policyEnforcer: PolicyEnforcer, deployer: Deployer) {
        this.#blueprintLoader = blueprintLoader
        this.#deployer = deployer
        this.#policyEnforcer = policyEnforcer
    }

    public run(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#blueprintLoader
                .load()
                .then((blueprint: Blueprint) => {
                    return new Promise((resolve, reject) => {
                        let errors = this.#policyEnforcer.check(blueprint)

                        if (errors.length > 0) {
                            reject(new RunError(errors))
                        } else {
                            resolve(blueprint)
                        }
                    })
                })
                .then((blueprint: Blueprint) => this.#deployer.deploy(blueprint))
                .then(resolve)
                .catch(reject)
        })
    }
}

export class RunError extends Error {

    constructor(errors: string[]) {
        super()
        this.name = 'Run Error'
        this.message = errors.join('\n')
    }
}