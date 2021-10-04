import { existsSync, copyFile } from 'fs';

export async function setup() {
  const dir = './';
  const envFile = 'metrixinfo-node.json';
  if (!existsSync(dir + envFile)) {
    console.log('> Creating default configuration file... Using \'' + 'default.' + envFile + '\'')
    copyFile(dir + 'default.' + envFile, dir + envFile, () => {
      console.log('>> Please modify the file \'' + envFile + '\' created in application root!\n');
      process.exit(1);
    });
  } else {
    console.log('> Found config file!');
  }
}

setup();
