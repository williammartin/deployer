import { Blueprint } from "./App";

export class PolicyEnforcer {

    #policies: Policy[]

    constructor() {
        this.#policies = [
            new NoLatestTagPolicy()
        ]
    }

    check(blueprint: Blueprint): string[] {
        const failures: string[] = []
        this.#policies.forEach((policy) => {
            const errors = policy.check(blueprint)
            if (errors.length > 0) {
                failures.push(...errors)
            }
        })

        return failures
    }
}

interface Policy {
    check(blueprint: Blueprint): string[]
}

class NoLatestTagPolicy {

    check(blueprint: Blueprint): string[] {
        const failures: string[] = []
        blueprint.containers.forEach((container) => {
            if (container.image.tag === 'latest') {
                failures.push(`container \`${container.name}\` with image \`${container.image.repository}\` cannot have tag \`latest\``)
            }
        })

        return failures
    }
}