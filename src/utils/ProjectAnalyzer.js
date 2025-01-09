import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * Analyzes a project to determine its type.
 */
export class ProjectAnalyzer {
  /**
   * @param {string} projectPath - The path to the project directory.
   */
  constructor(projectPath) {
    this.projectPath = projectPath
  }

  /**
   * Detects the type of the project.
   * @returns {Promise<string>} The type of the project (e.g., 'vue', 'node', 'javascript').
   */
  async detectProjectType() {
    try {
      const packageJson = JSON.parse(
        await readFile(join(this.projectPath, 'package.json'), 'utf-8')
      )

      if (this.isVueProject(packageJson)) {
        return 'vue'
      }

      if (this.isNodeProject(packageJson)) {
        return 'node'
      }

      return 'javascript'
    }
		catch (error) {
      if (error.code === 'ENOENT') {
        return 'javascript'
      }
      throw error
    }
  }

  /**
   * Checks if the project is a Vue.js project.
   * @param {object} packageJson - The parsed package.json file.
   * @returns {boolean} True if the project is a Vue.js project, false otherwise.
   */
  isVueProject (packageJson) {
    return !!(
      packageJson.dependencies?.vue ||
      packageJson.devDependencies?.vue ||
      packageJson.dependencies?.['@vue/cli-service'] ||
      packageJson.devDependencies?.['@vue/cli-service']
    )
  }

  /**
   * Checks if the project is a Node.js project.
   * @param {object} packageJson - The parsed package.json file.
   * @returns {boolean} True if the project is a Node.js project, false otherwise.
   */
  isNodeProject (packageJson) {
    return !!(
      packageJson.type === 'module' ||
      packageJson.type === 'commonjs' ||
      packageJson.engines?.node ||
      packageJson.dependencies?.express ||
      packageJson.dependencies?.['@types/node']
    )
  }
}