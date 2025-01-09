import { describe, it, expect, vi } from 'vitest'
import { FileWatcher } from '../src/utils/FileWatcher.js'

vi.mock('fs/promises', () => ({
	watch: vi.fn(() => ({
		[Symbol.asyncIterator]: function* () {
			yield { filename: 'file.js' }
		},
	})),
}))

describe('FileWatcher', () => {
	const projectPath = '/path/to/project'
	const options = { output: 'docs' }
	const watcher = new FileWatcher(projectPath, options)

	it('should call the callback on file changes', async () => {
		const callback = vi.fn()
		await watcher.watch(callback)
		expect(callback).toHaveBeenCalled()
	})

	it('should ignore files in the output directory', () => {
		expect(watcher.shouldIgnoreFile('docs/file.js')).toBe(true)
		expect(watcher.shouldIgnoreFile('node_modules/file.js')).toBe(true)
		expect(watcher.shouldIgnoreFile('.hiddenfile')).toBe(true)
		expect(watcher.shouldIgnoreFile('src/file.js')).toBe(false)
	})
})