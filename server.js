const fs = require('fs');
const path = require('path');
const util = require('util');

const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);

async function readdirChronoSorted(dirpath, order) {
  order = order || 1;
  const files = await readdirAsync(dirpath);
  const stats = await Promise.all(
    files.map((filename) =>
      statAsync(path.join(dirpath, filename))
        .then((stat) => ({ filename, stat }))
    )
  );
  return stats.sort((a, b) =>
    order * (b.stat.mtime.getTime() - a.stat.mtime.getTime())
  ).map((stat) => stat.filename);
}

(async () => {
  try {
    const dirpath = path.join(__dirname);
    const dirpath1 = '/opt/lampp/htdocs/chart'
    // console.log(await readdirChronoSorted(dirpath1));
    console.log(await readdirChronoSorted(dirpath1));
  } catch (err) {
    console.log(err);
  }
})();