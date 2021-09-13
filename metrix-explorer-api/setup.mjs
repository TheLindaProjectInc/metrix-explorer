import { existsSync, copyFile } from 'fs';

export async function setup() {
  const dir = './config/';
  const envFileDef = 'config.default.js';
  const envFilePrd = 'config.prod.js';
  const envFileDev = 'config.dev.js';
  const envFileloc = 'config.local.js';
  if (process.env.NODE_ENV === 'local' && !existsSync(dir + envFileloc)) {
    console.log('> Creating local configuration file... ' + envFileloc)
    copyFile(dir + envFileDef, dir + envFileloc, () => {
      console.log('\n>> You may modify the file \'' + envFileloc + '\' created in application ' + dir + '');
      process.exit(1);
    });
  } else if (process.env.NODE_ENV === 'development' && !existsSync(dir + envFileDev)) {
    console.log('> Creating development configuration file... ' + envFileDev)
    copyFile(dir + envFileDef, dir + envFileDev, () => {
      console.log('\n>> You may modify the file \'' + envFileDev + '\' created in application ' + dir + '');
      process.exit(1);
    });
  } else if (process.env.NODE_ENV === 'production' && !existsSync(dir + envFilePrd)) {
    console.log('> Creating default prod configuration file...  Using \'' + envFileDef + '\'')
    copyFile(dir + envFileDef, dir + envFilePrd, () => {
      console.log('\n>> Please modify the file \'' + envFilePrd + '\' created in application ' + dir + '');
      process.exit(1);
    });
  } else {
    console.log('> Found config file for ' + process.env.NODE_ENV + '!');
  }
}

setup();
