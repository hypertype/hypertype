const sh = require('shelljs');
const path = require('path');
const pkgConfig = require('../package');

let [major, minor, patch] = pkgConfig.version.split('.');

const type = process.argv[2];
switch (type) {
    case 'major':
        major++;
        minor = patch = 0;
        break;
    case 'minor':
        minor++;
        patch = 0;
        break;
    case 'patch':
        patch++;
        break;
    default:
        [major, minor, patch] = type.split('.');
        break;
}
const version = [major, minor, patch].join('.');

const tsConfig = require('../tsconfig');
const projects = tsConfig.references.map(r => r.path)
    .map(p => path.join(__dirname,'..', p));


console.log(`set version ${version}`);
sh.exec(`npm version ${version} --allow-same-version`);
Promise.all(projects.map(async project => {
    sh.cd(project);
    sh.exec(`git checkout master`);
    sh.exec(`npm version ${version} --allow-same-version`);
}));
console.log('build', sh.exec(`npm run build`).stdout);
Promise.all(projects.map(async project => {
    sh.cd(project);
    sh.exec(`git checkout develop`);
}));

