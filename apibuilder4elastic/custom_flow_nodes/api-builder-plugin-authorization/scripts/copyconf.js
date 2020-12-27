#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const packageName = require('../package.json').name;
const { COPYFILE_EXCL } = fs.constants;
const projectDir = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1);
const config = 'authorization-config.default.js';
const srcConf = path.resolve(__dirname, '..', 'config', config);
const projConfDir = path.resolve(projectDir, 'conf');
const projConf = path.resolve(projConfDir, config);

// this makes sure it doesn't run on a dev npm install
if (process.env.NODE_ENV === 'production') {
	process.exit(0);
}

const banner = (titleColor, textColor, status, msg) => {
	const width = process.stdout.columns,
		border = '='.repeat(width),
		title = `[${status.toUpperCase()}] ${packageName}:\n`;

	msg = msg || '';
	// eslint-disable-next-line no-console
	console.log(chalk[titleColor](`\n${border}`));
	// eslint-disable-next-line no-console
	console.log(chalk[titleColor].bold(title));
	// eslint-disable-next-line no-console
	console.log(chalk[textColor](msg));
	// eslint-disable-next-line no-console
	console.log(chalk[titleColor](`${border}\n`));
};

const warn = (msg) => {
	banner('yellow', 'yellow', 'warning', msg);
};

const info = (msg) => {
	banner('green', 'white', 'info', msg);
};

const copyFile = (source, dest) => {
	try {
		fs.copyFileSync(source, dest, COPYFILE_EXCL);
	} catch (e) {
		throw new Error(`Unable to copy config file ${source} to ${dest}.\n\n${e.message || e}`);
	}
};

try {
	if (!fs.existsSync(projConfDir)) {
		info(`conf directory not found in ${projectDir}. Are you in an API Builder project?`);
	} else if (fs.existsSync(projConf)) {
		info(`Connector configuration file already exists at ${projConf}.\nYou can find a copy of the default config at ${srcConf}`);
	} else {
		copyFile(srcConf, projConf);
		info(`${config} has been copied to your API Builder conf directory. You must configure the file located in ${projConfDir}`);
	}
} catch (e) {
	warn(e.message);
}
