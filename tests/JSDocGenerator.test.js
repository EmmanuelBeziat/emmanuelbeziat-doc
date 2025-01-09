import { describe, it, expect, vi } from 'vitest'
import { JSDocGenerator } from '../src/generators/jsdoc.js'
import { join } from 'path'

vi.mock('../src/generators/BaseGenerator.js', () => ({
	BaseGenerator: class {
		constructor(projectPath, options) {
			this.projectPath = projectPath
			this.options = options
			this.runCommand = vi.fn()
			this.writeConfig = vi.fn()
		}
		getOutputPath() {
			return join(this.projectPath, this.options.output || 'docs')
		}
	},
}))

describe('JSDocGenerator', () => {
	const projectPath = '/path/to/project'
	const options = { output: 'docs' }
	const generator = new JSDocGenerator(projectPath, options)

	it('should create a JSDoc config and run the command', async () => {
		await generator.generate()
		expect(generator.writeConfig).toHaveBeenCalled()
		expect(generator.runCommand).toHaveBeenCalledWith(`npx jsdoc -c ${join(projectPath, 'jsdoc.json')}`)
	})
})