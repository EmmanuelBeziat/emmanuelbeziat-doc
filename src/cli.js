#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { generateDocs } from './index.js'

const program = new Command()

program
	.name('docgen')
	.description('Documentation generator for JavaScript projects')
	.version('1.0.0')
	.argument('<project-path>', 'Path to the project directory')
	.option('-o, --output <path>', 'Output directory for documentation', 'docs')
	.option('-w, --watch', 'Watch for changes and regenerate docs', false)
	.action(async (projectPath, options) => {
		try {
			console.log(chalk.blue('📝 Generating documentation...'))
			await generateDocs(projectPath, options)
			console.log(chalk.green('✨ Documentation generated successfully!'))
		}
		catch (error) {
			console.error(chalk.red('Error:'), error.message)
			process.exit(1)
		}
	})

program.parse()