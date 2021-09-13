import { existsSync, copyFile } from 'fs';

export async function setup() {
  const envFile = '.env';
  if (!existsSync(envFile)) {
    copyFile('default' + envFile, envFile, () => { console.log('Created default .env file!'); });
  } else {
    console.log('Found .env file!');
  }
}

setup();
