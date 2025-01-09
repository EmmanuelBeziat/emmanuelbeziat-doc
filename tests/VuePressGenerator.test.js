import { describe, it, expect, vi } from 'vitest'
import { VuePressGenerator } from '../src/generators/vuepress.js'
import { join } from 'path'

vi.mock('../src/generators/BaseGenerator.js', () => ({
	BaseGenerator: class {
		constructor() {
			this.runCommand = vi.fn()
			this.writeConfig = vi.fn()
			this.createDirectory = vi.fn()
		}
	},
}))

describe('VuePressGenerator', () => {
	const projectPath = '/path/to/project'
	const options = { output: 'docs' }
	const generator = new VuePressGenerator(projectPath, options)

	it('should create a VuePress config, install dependencies, and run the command', async () => {
		await generator.generate()
		expect(generator.createDirectory).toHaveBeenCalledWith(join(projectPath, '.vuepress'))
		expect(generator.writeConfig).toHaveBeenCalled()
		expect(generator.runCommand).toHaveBeenCalledWith('npm install -D vuepress@next')
		expect(generator.runCommand).toHaveBeenCalledWith('npx vuepress build docs')
	})
})