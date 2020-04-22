# desktop_tensorflow
Tools &amp; examples for running Tensorflow in Desktop apps

## Motivation
This example Electron app shows how to ship a Tensorflow.js model as part of a desktop CLI. It's especially useful in cases where you need to ship a model to be used with desktop apps on Windows, Mac or Linux, and you can't count on having CUDA, etc. installed.

Tensorflow.js natively uses WebGL for rendering, so you get GPU acceleration on most devices. Electron allows you to load TF.js and WebGL without a browser.

## Getting started
1. Install [Node.js + Electron](https://www.electronjs.org/docs/tutorial/installation)
2. Download TF.js. You can get it from (https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js) and (https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-automl)
3. Get a model in tf.js. You'll probably need to modify the code in worker.js
4. Call `npm start -- --image=<your_image_path>`
5. (optional) If you want to distribute this app, check out [Electron's guide](https://www.electronjs.org/docs/tutorial/application-distribution)

## Architecture
The project consists of a few important elements:
- Dependencies
 - *Electron*: Electron is a wrapper around Chromium. It's basically a stripped-down web browser, so it can run your tf.js code with WebGL GPU acceleration
- Files:
 - main.js: the main method of the program. It sets up the "worker" which will run Tensorflow, receives an image path over command line arguments, sends it to the worker, and writes the result back to command line
 - preload.js: start-up script for the worker. Just adds some communication functions
 - worker.js: This looks a lot like a webpage. It loads tf.js and your model, receives the image path, loads
