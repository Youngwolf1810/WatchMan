#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const chalk = require('chalk');

const { spawn } = require('child_process');

program.version('1.1.0')
.argument('[fileName]', 'Name of file to be executed')
.action(async ({ fileName }) => {
	const name = fileName || 'index.js';

	try {
		await fs.promises.access(name);
	} catch (err) {
		console.log(`file ${name} not found!!`);
    }

   
    let proc;
    const temp = arg => {
        if(proc){
            proc.kill();
        }
        if(arg==1)console.log(chalk.yellow('>>>>> New Files detected'));
        if(arg==3)console.log(chalk.yellow('>>>>> File deletion detected'));
        
        if(arg==2){
            console.log(chalk.yellow('>>>>> File Change detected'));
            console.log(chalk.blue('>>>>> restarting app'));
        }
        if(arg==1 || arg==2)
        proc = spawn('node', [ name ], { stdio: 'inherit' })
}

    const start1 = debounce(()=>{temp(1)},200);
    const start2 = debounce(()=>{temp(2)},200);
    const start3 = debounce(()=>{temp(3)},200);

    // let proc;
	// const start = debounce(() => {
    //     if(proc){
    //         proc.kill();
    //     }
    //     console.log(chalk.yellow('>>>>> File Change detected'));
    //     console.log(chalk.blue('>>>>> restarting app'));
    //     proc = spawn('node', [ name ], { stdio: 'inherit' })}
    //     , 200);
    chokidar.watch('.')
    .on('add', start1)
    .on('change', start2)
    .on('unlink', start3);
});

program.parse(process.argv);
