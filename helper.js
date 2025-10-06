#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// Detecta se é Windows
const npmCmd = os.platform() === 'win32' ? 'npm.cmd' : 'npm';

const [,, command, ...args] = process.argv;

const typeormPath = 'dist/config/typeorm.config.js'

if (!command) {
  console.error('Erro: nenhum comando fornecido.');
  process.exit(1);
}

function runCommand(cmdArgs) {
  console.log('Executando:', [npmCmd, 'run', 'typeorm', '--', ...cmdArgs].join(' '));
  const proc = spawn(npmCmd, ['run', 'typeorm', '--', ...cmdArgs], { stdio: 'inherit' });

  proc.on('exit', code => process.exit(code));
}

switch(command) {
  case 'migration:run':
    runCommand(['migration:run', '-d', typeormPath]);
    break;

  case 'migration:revert':
    runCommand(['migration:revert', '-d', typeormPath]);
    break;

  case 'migration:create':
    if (args.length === 0) {
      console.error('Erro: migration:create requer o nome da migration.');
      process.exit(1);
    }
    runCommand(['migration:create', `src/migrations/${args[0]}`]);
    break;

  case 'migration:generate':
    if (args.length === 0) {
      console.error('Erro: migration:generate requer o nome da migration.');
      process.exit(1);
    }
    runCommand(['migration:generate', `src/migrations/${args[0]}`, '-d', typeormPath]);
    break;

  case 'entity:create':
    if (args.length < 2) {
      console.error('Erro: entity:create requer <módulo> e <entidade>.');
      process.exit(1);
    }
    const [moduleName, entityName] = args;
    const path = `src/${moduleName}/entities/${entityName}.entity`;
    runCommand(['entity:create', path]);
    break;

  default:
    console.error('Comando desconhecido:', command);
    process.exit(1);
}
