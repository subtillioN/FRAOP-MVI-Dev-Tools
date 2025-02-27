#!/usr/bin/env node

const { cli } = require('../dist');

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    switch (command) {
      case 'validate':
        await cli.validate(args[0] || 'all');
        break;
      case 'ttsd:watch':
        await cli.ttsdWatch();
        break;
      default:
        console.log(`
Usage:
  fraop-mvi-dev-tools validate [functional|modules|all]  Run validation
  fraop-mvi-dev-tools ttsd:watch                        Start TTSD watch mode
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 