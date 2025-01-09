import { JSDocGenerator } from './generators/jsdoc.js'
import { VuePressGenerator } from './generators/vuepress.js'
import { ProjectAnalyzer } from './utils/ProjectAnalyzer.js'

/**
 * Factory for creating documentation generators based on project type.
 */
export class DocumentationFactory {
  /**
   * @param {string} projectPath - The path to the project directory.
   * @param {object} [options={}] - Options for the documentation generator.
   */
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath
    this.options = options
    this.analyzer = new ProjectAnalyzer(projectPath)
  }

  /**
   * Creates a documentation generator based on the project type.
   * @returns {Promise<BaseGenerator>} An instance of a documentation generator.
   * @throws Will throw an error if the project type is unsupported.
   */
  async createGenerator() {
    const projectType = await this.analyzer.detectProjectType()

    switch (projectType) {
      case 'vue':
        return new VuePressGenerator(this.projectPath, this.options)
      case 'node':
      case 'javascript':
        return new JSDocGenerator(this.projectPath, this.options)
      default:
        throw new Error(`Unsupported project type: ${projectType}`)
    }
  }
}