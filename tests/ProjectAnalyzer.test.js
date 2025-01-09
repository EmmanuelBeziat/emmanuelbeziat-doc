import { ProjectAnalyzer } from '../src/utils/ProjectAnalyzer'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFile } from 'fs/promises'

// Mock the readFile function from fs/promises
vi.mock('fs/promises', () => ({
	readFile: vi.fn(),
}))

describe('ProjectAnalyzer', () => {
	let analyzer

	beforeEach(() => {
		analyzer = new ProjectAnalyzer('/fake/path')
	})

	it('should detect a Vue project', async () => {
		readFile.mockResolvedValueOnce(JSON.stringify({ dependencies: { vue: '^3.0.0' } }))
		const type = await analyzer.detectProjectType()
		expect(type).toBe('vue')
	})

	it('should detect a Node project', async () => {
		readFile.mockResolvedValueOnce(JSON.stringify({ engines: { node: '>=14.0.0' } }))
		const type = await analyzer.detectProjectType()
		expect(type).toBe('node')
	})

	it('should default to JavaScript project if no specific type is found', async () => {
		readFile.mockResolvedValueOnce(JSON.stringify({}))
		const type = await analyzer.detectProjectType()
		expect(type).toBe('javascript')
	})

	it('should default to JavaScript project if package.json is missing', async () => {
		readFile.mockRejectedValueOnce({ code: 'ENOENT' })
		const type = await analyzer.detectProjectType()
		expect(type).toBe('javascript')
	})
})