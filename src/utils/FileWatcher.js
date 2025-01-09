import { watch } from 'fs/promises'
import chalk from 'chalk'

/**
 * Watches for file changes in a project directory.
 */
export class FileWatcher {
	/**
	 * @param {string} projectPath - The path to the project directory.
	 * @param {object} [options={}] - Options for the file watcher.
	 */
	constructor(projectPath, options = {}) {
		this.projectPath = projectPath
		this.options = options
	}

	/**
	 * Starts watching for file changes.
	 * @param {Function} callback - The callback to execute on file changes.
	 */
	async watch(callback) {
		console.log(chalk.blue('👀 Watching for changes...'))
		const watcher = watch(this.projectPath, { recursive: true })

		for await (const event of watcher) {
			if (this.shouldIgnoreFile(event.filename)) {
				continue
			}

			console.log(chalk.yellow(`📝 Changes detected in ${event.filename}, regenerating docs...`))

			try {
				await callback()
				console.log(chalk.green('✨ Documentation updated successfully!'))
			}
			catch (error) {
				console.error(chalk.red('Error updating documentation:'), error.message)
			}
		}
	}

	/**
	 * Determines if a file should be ignored.
	 * @param {string} filename - The name of the file.
	 * @returns {boolean} True if the file should be ignored, false otherwise.
	 */
	shouldIgnoreFile(filename) {
		return (
			filename.startsWith(this.options.output || 'docs') ||
			filename.includes('node_modules') ||
			filename.startsWith('.')
		)
	}
}