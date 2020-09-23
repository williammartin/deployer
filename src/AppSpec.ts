import { App, Blueprint, RunError } from './App'

describe('App', () => {

    const testBlueprint: Blueprint = {
        containers: [
            {
                name: "test-name",
                image: {
                    repository: "test-repo",
                    tag: "test-tag"
                }
            }
        ]
    }

    it('loads the blueprint', async () => {
        const load = jest.fn().mockResolvedValue(testBlueprint)
        const check = jest.fn().mockReturnValue([])

        const app = new App({ load }, { check }, { deploy: jest.fn() })
        await app.run();

        expect(load).toHaveBeenCalled()
    })

    describe('when loading the blueprint errors', () => {

        it('wraps and bubbles the error', async () => {
            const load = jest.fn().mockRejectedValue(new Error("failed to load blueprint"))
            const check = jest.fn().mockReturnValue([])

            const app = new App({ load }, { check }, { deploy: jest.fn() })

            await expect(app.run()).rejects.toThrowError("failed to load blueprint")
        })
    })

    it('checks policies against the blueprint', async () => {
        const load = jest.fn().mockResolvedValue(testBlueprint)
        const check = jest.fn().mockReturnValue([])

        const app = new App({ load }, { check }, { deploy: jest.fn() })
        await app.run();

        expect(check).toHaveBeenCalledWith(testBlueprint)
    })

    describe('when there are policy check failures', () => {

        it('rejects with a run error, wrapping the policy failures', async () => {
            const load = jest.fn().mockResolvedValue(testBlueprint)
            const check = jest.fn().mockReturnValue(['foo', 'bar', 'baz'])

            const app = new App({ load }, { check }, { deploy: jest.fn() })
            await expect(app.run()).rejects.toThrowError(new RunError(['foo', 'bar', 'baz']))
        })
    })

    it('deploys the blueprint that is loaded', async () => {
        const load = jest.fn().mockResolvedValue(testBlueprint)
        const check = jest.fn().mockReturnValue([])
        const deploy = jest.fn()

        const app = new App({ load }, { check }, { deploy })
        await app.run();

        expect(deploy).toHaveBeenCalledWith(testBlueprint)
    })

    describe('when deploying errors', () => {
        it('wraps and bubbles the error', async () => {
            const load = jest.fn().mockResolvedValue(testBlueprint)
            const check = jest.fn().mockReturnValue([])
            const deploy = jest.fn().mockRejectedValue(new Error("failed to deploy"))

            const app = new App({ load }, { check }, { deploy })

            await expect(app.run()).rejects.toThrowError("failed to deploy")
        })
    })
})