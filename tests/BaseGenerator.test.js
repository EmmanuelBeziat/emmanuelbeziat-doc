import { describe, it, expect, vi } from 'vitest'
import { BaseGenerator } from '../src/generators/BaseGenerator.js'
import { join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

vi.mock('fs/promises', () => ({
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}))

describe('BaseGenerator', () => {
	const projectPath = '/path/to/project'
	const options = { output: 'docs' }
	const generator = new BaseGenerator(projectPath, options)

	it('should create a directory', async () => {
		await generator.createDirectory('/path/to/dir')
		expect(mkdir).toHaveBeenCalledWith('/path/to/dir', { recursive: true })
	})

	it('should write a config file', async () => {
		const configPath = '/path/to/config.json'
		const content = { key: 'value' }
		await generator.writeConfig(configPath, content)
		expect(writeFile).toHaveBeenCalledWith(configPath, JSON.stringify(content, null, 2))
	})

	it('should return the correct output path', () => {
		const outputPath = generator.getOutputPath()
		expect(outputPath).toBe(join(projectPath, 'docs'))
	})
})