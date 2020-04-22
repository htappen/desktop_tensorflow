const modelUrl = './model/model.json';

// You'll need to fix this with loading your own model in JS.
// I've borrowed the AutoML class for image classification, but it probably
// won't work with most models.
const modelPromise = tf.automl.loadImageClassification(modelUrl);

window.electron.getExamples((event, ...imagePaths) => {
  // Render the image pixels. We'll pass this over to the model after loading
  const img = document.getElementById('exampleImg');
  const imgPromise = new Promise((accept, reject) => {
    img.addEventListener('load', () => {
      accept(img);
    });
    img.addEventListener('error', (e) => {
      reject(e);
    })
    img.src = imagePaths[0];
  });

  Promise.all([modelPromise, imgPromise]).then((args) => {
    const [ model, img ] = args;
    const options = {centerCrop: true};
    return model.classify(img, options);
  }).then((predictions) => {
    return window.electron.sendPredictions(predictions[0].prob);
  }).catch((error) => {
    window.electron.sendErrors(error);
  });
});
