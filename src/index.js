import { DocumentationFactory } from './DocumentationFactory.js'
import { FileWatcher } from './utils/FileWatcher.js'
import { resolve } from 'path'

export async function generateDocs(projectPath, options = {}) {
	const absolutePath = resolve(process.cwd(), projectPath)
	const factory = new DocumentationFactory(absolutePath, options)

	if (options.watch) {
		const watcher = new FileWatcher(absolutePath, options)
		return watcher.watch(async () => {
			const generator = await factory.createGenerator()
			await generator.generate()
		})
	}

	const generator = await factory.createGenerator()
	return generator.generate()
}