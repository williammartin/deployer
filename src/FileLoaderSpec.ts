import { Blueprint } from "./App"
import { FileLoader } from "./FileLoader"

describe('File Loader', () => {

    describe('when the file is well-formed', () => {
        it('resolves with a Blueprint matching the files contents', async () => {
            const loader = new FileLoader("./tests/assets/nginx.yaml")
            const blueprint: Blueprint = await loader.load()

            expect(blueprint).toEqual({
                containers: [
                    {
                        name: "test-nginx",
                        image: {
                            repository: "nginx",
                            tag: "1.19"
                        }
                    }
                ]
            })
        })
    })

    describe('when the file is malformed', () => {
        it('rejects with an error', async () => {
            const loader = new FileLoader("./tests/assets/malformed.yaml")
            await expect(loader.load()).rejects.toThrowError("blueprint yaml is malformed")
        })
    })

    describe('when the file does not exist', () => {
        it('rejects with an error', async () => {
            const loader = new FileLoader("non-existent-file-path")
            await expect(loader.load()).rejects.toThrowError("no such file or directory")
        })
    })

})