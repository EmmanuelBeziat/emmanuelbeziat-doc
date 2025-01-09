import { join } from 'path'
import { BaseGenerator } from './BaseGenerator.js'
import { existsSync } from 'fs'

/**
 * JSDoc generator for JavaScript projects.
 * @extends BaseGenerator
 */
export class JSDocGenerator extends BaseGenerator {
  /**
   * @param {string} projectPath - The path to the project directory.
   * @param {object} options - Options for the JSDoc generator.
   */
  constructor(projectPath, options) {
    super(projectPath, options)
    this.configPath = join(projectPath, 'jsdoc.json')
  }

  /**
   * Generates documentation using JSDoc.
   * @returns {Promise<string>} The standard output from the JSDoc command.
   */
  async generate() {
    await this.createJSDocConfig()
    return this.runCommand(`npx jsdoc -c ${this.configPath}`)
  }

  /**
   * Creates the JSDoc configuration file.
   * @throws Will throw an error if the config file cannot be written.
   */
  async createJSDocConfig() {
    const includeDirs = []
    if (existsSync(join(this.projectPath, 'src'))) {
      includeDirs.push('src')
    }
    if (existsSync(join(this.projectPath, 'lib'))) {
      includeDirs.push('lib')
    }

    const config = {
      source: {
        include: includeDirs,
        includePattern: '.+\\.(js|jsx|ts|tsx|vue)$',
        excludePattern: '(node_modules/|docs)'
      },
      plugins: ['plugins/markdown'],
      opts: {
        destination: this.getOutputPath(),
        recurse: true,
        template: 'templates/default'
      },
      templates: {
        cleverLinks: true,
        monospaceLinks: true
      }
    }

    await this.writeConfig(this.configPath, config)
  }
}