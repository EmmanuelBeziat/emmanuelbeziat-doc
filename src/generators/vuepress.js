import { join } from 'path'
import { BaseGenerator } from './BaseGenerator.js'

/**
 * VuePress generator for Vue.js projects.
 * @extends BaseGenerator
 */
export class VuePressGenerator extends BaseGenerator {
  /**
   * @param {string} projectPath - The path to the project directory.
   * @param {object} options - Options for the VuePress generator.
   */
  constructor(projectPath, options) {
    super(projectPath, options)
    this.docsPath = join(projectPath, '.vuepress')
  }

  /**
   * Generates documentation using VuePress.
   * @returns {Promise<string>} The standard output from the VuePress command.
   */
  async generate() {
    await this.createVuePressConfig()
    await this.runCommand('npm install -D vuepress@next')
    return this.runCommand('npx vuepress build docs')
  }

  /**
   * Creates the VuePress configuration file.
   * @throws Will throw an error if the config file cannot be written.
   */
  async createVuePressConfig() {
    const config = {
      title: 'Project Documentation',
      description: 'Generated documentation',
      theme: '@vuepress/theme-default',
      themeConfig: {
        navbar: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'API', link: '/api/' }
        ],
        sidebar: 'auto'
      }
    }

    await this.createDirectory(this.docsPath)
    await this.writeConfig(
      join(this.docsPath, 'config.js'),
      `export default ${JSON.stringify(config, null, 2)}`
    )
  }
}