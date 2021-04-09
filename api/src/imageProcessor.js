const path = require('path');
const { __ } = require('ramda');
const { Worker, isMainThread } = require('worker_threads');

const pathToResizeWorker = path.resolve(__dirname, 'resizeWorker.js');
const pathToMonochromeWorker = path.resolve(__dirname, 'monochromeWorker.js');

const uploadPathResolver = (filename) => {
  return path.resolve(__dirname, '../uploads', filename);
};

const imageProcessor = (filename) => {
  const sourcePath = uploadPathResolver(filename);
  const resizedDestination = uploadPathResolver('resized-' + filename);
  const monochromeDestination = uploadPathResolver('monochrome-' + filename);
  let resizeWorkerFinished = false;
  let monochromeWorkerFinished = false;
  new Promise((resolve, reject) => {
    if (isMainThread) {
      try {
        resizeWorker = Worker(pathToResizeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        })
          .on('message', (message) => {
            resizeWorkerFinishe = true;
            if (monochromeWorkerFinished) {
              resolve('resizeWorker finished processing');
            }
          })
          .on('error', (error) => {
            reject(new Error(error.message));
          })
          .on('exit', (code) => {
            if (code !== 0) {
              reject(new Error(`Exited with status code ${code} `));
            }
          });
        monochromeWorker = Worker(pathToMonochromeWorker, {
          workerData: {
            source: sourcePath,
            destination: monochromeDestination,
          },
        })
          .on('message', (message) => {
            monochromeWorkerFinished = true;
            if (monochromeWorkerFinished) {
              resolve('monochromeWorker finished processing');
            }
          })
          .on('error', (error) => {
            reject(new Error(error.message));
          })
          .on('exit', (code) => {
            if (code !== 0) {
              reject(new Error(`Exited with status code ${code}`));
            }
          });
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('not on main thread'));
    }
  });
};
module.exports = imageProcessor;
