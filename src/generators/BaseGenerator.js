import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

/**
 * Base class for documentation generators.
 */
export class BaseGenerator {
	/**
	 * @param {string} projectPath - The path to the project directory.
	 * @param {object} [options={}] - Options for the generator.
	 */
	constructor(projectPath, options = {}) {
		this.projectPath = projectPath
		this.options = options
		this.execAsync = promisify(exec)
	}

	/**
	 * Creates a directory if it doesn't exist.
	 * @param {string} path - The path to the directory.
	 * @throws Will throw an error if the directory cannot be created.
	 */
	async createDirectory(path) {
		try {
			await mkdir(path, { recursive: true })
		}
		catch (error) {
			throw new Error(`Failed to create directory: ${error.message}`)
		}
	}

	/**
	 * Writes a configuration file.
	 * @param {string} path - The path to the config file.
	 * @param {object} content - The content to write to the config file.
	 * @throws Will throw an error if the config file cannot be written.
	 */
	async writeConfig(path, content) {
		try {
			await writeFile(path, JSON.stringify(content, null, 2))
		}
		catch (error) {
			throw new Error(`Failed to write config: ${error.message}`)
		}
	}

	/**
	 * Executes a shell command.
	 * @param {string} command - The command to execute.
	 * @param {string} [cwd=this.projectPath] - The current working directory for the command.
	 * @returns {Promise<string>} The standard output from the command.
	 * @throws Will throw an error if the command execution fails.
	 */
	async runCommand(command, cwd = this.projectPath) {
		try {
			const { stdout, stderr } = await this.execAsync(command, { cwd })
			if (stderr) {
				console.error(`Warnings: ${stderr}`)
			}
			return stdout
		}
		catch (error) {
			throw new Error(`Command execution failed: ${error.message}`)
		}
	}

	/**
	 * Gets the output path for the documentation.
	 * @returns {string} The output path.
	 */
	getOutputPath() {
		return join(this.projectPath, this.options.output || 'docs')
	}
}