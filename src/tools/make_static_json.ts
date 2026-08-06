// Generates the files settings.json and translations.json, stored in src/genfiles
import '@/server/init';

import child_process from 'child_process';
import fs from 'fs';
import * as constants from '../common/constants';

function mkdirQuietly(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function getBuildMetadata(): { head: string; date: string } {
  // assumes SOURCE_VERSION is git hash
  if (process.env.SOURCE_VERSION) {
    return {
      head: process.env.SOURCE_VERSION.substring(0, 7),
      date: new Date().toUTCString().replace(/ \(.+\)/, ''),
    };
  }
  try {
    const output = child_process
      .execSync(`git log -1 --pretty=format:"%h %cD"`)
      .toString();
    const [head, ...rest] = output.split(' ');
    return { head, date: rest.join(' ') };
  } catch (error) {
    console.error('unable to generate app version', error);
    return { head: 'n/a', date: 'n/a' };
  }
}

function writeBuildMetadata() {
  function getEnv(ev: string, dv: number) {
    return process.env[ev] ? Number(process.env[ev]) : dv;
  }

  const buildmetadata = getBuildMetadata();
  const settings = {
    head: buildmetadata.head,
    builtAt: buildmetadata.date,
    waitingForTimeout: getEnv(
      'WAITING_FOR_TIMEOUT',
      constants.DEFAULT_WAITING_FOR_TIMEOUT,
    ),
    logLength: getEnv('LOG_LENGTH', constants.DEFAULT_LOG_LENGTH),
    discordClientId: process.env['DISCORD_CLIENT_ID'] ?? '',
  };
  fs.writeFileSync('src/genfiles/settings.json', JSON.stringify(settings));
}

mkdirQuietly('src/genfiles');

writeBuildMetadata();
