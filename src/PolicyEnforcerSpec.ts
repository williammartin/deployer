import { PolicyEnforcer } from "./PolicyEnforcer"

describe('Policy Enforcer', () => {
    it('returns the mismatch policy from a blueprint', () => {
        const blueprint = {
            containers: [
                {
                    name: "test-nginx",
                    image: {
                        repository: "nginx",
                        tag: "latest",
                    }
                }
            ]
        }

        const policyEnforcer = new PolicyEnforcer()
        expect(policyEnforcer.check(blueprint)).toEqual(['container `test-nginx` with image `nginx` cannot have tag `latest`'])
    })
})