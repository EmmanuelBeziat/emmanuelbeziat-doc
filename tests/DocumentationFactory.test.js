import { DocumentationFactory } from '../src/DocumentationFactory'
import { JSDocGenerator } from '../src/generators/jsdoc.js'
import { VuePressGenerator } from '../src/generators/vuepress.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockDetectProjectType = vi.fn()

vi.mock('../src/utils/ProjectAnalyzer', () => ({
	ProjectAnalyzer: class {
		constructor() {}
		detectProjectType = mockDetectProjectType
	},
}))

vi.mock('../src/generators/jsdoc.js', () => ({
	JSDocGenerator: vi.fn(),
}))

vi.mock('../src/generators/vuepress.js', () => ({
	VuePressGenerator: vi.fn(),
}))

describe('DocumentationFactory', () => {
	let factory

	beforeEach(() => {
		factory = new DocumentationFactory('/fake/path')
		mockDetectProjectType.mockClear()
	})

	it('should create a VuePressGenerator for a Vue project', async () => {
		mockDetectProjectType.mockResolvedValueOnce('vue')
		const generator = await factory.createGenerator()
		expect(generator).toBeInstanceOf(VuePressGenerator)
	})

	it('should create a JSDocGenerator for a Node project', async () => {
		mockDetectProjectType.mockResolvedValueOnce('node')
		const generator = await factory.createGenerator()
		expect(generator).toBeInstanceOf(JSDocGenerator)
	})

	it('should create a JSDocGenerator for a JavaScript project', async () => {
		mockDetectProjectType.mockResolvedValueOnce('javascript')
		const generator = await factory.createGenerator()
		expect(generator).toBeInstanceOf(JSDocGenerator)
	})

	it('should throw an error for an unsupported project type', async () => {
		mockDetectProjectType.mockResolvedValueOnce('unsupported')
		await expect(factory.createGenerator()).rejects.toThrow('Unsupported project type: unsupported')
	})
})