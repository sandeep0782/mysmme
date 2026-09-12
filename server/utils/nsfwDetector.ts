import * as tf from "@tensorflow/tfjs-node";
import * as nsfwjs from "nsfwjs";

type NSFWPrediction = {
  className: string;
  probability: number;
};

let model: nsfwjs.NSFWJS | null = null;

const loadModel = async (): Promise<nsfwjs.NSFWJS> => {
  if (model) {
    return model;
  }

  tf.enableProdMode();

  model = await nsfwjs.load();

  return model;
};

export const checkImageForNudity = async (
  imageBuffer: Buffer,
): Promise<{
  safe: boolean;
  predictions: NSFWPrediction[];
}> => {
  const nsfwModel = await loadModel();

  const imageTensor = tf.node.decodeImage(imageBuffer, 3);

  try {
    const predictions = (await nsfwModel.classify(
      imageTensor as tf.Tensor3D,
    )) as NSFWPrediction[];

    for (const prediction of predictions) {
      console.log(
        `${prediction.className}: ${(prediction.probability * 100).toFixed(
          2,
        )}%`,
      );
    }

    const porn = predictions.find(
      (prediction) => prediction.className === "Porn",
    );

    const hentai = predictions.find(
      (prediction) => prediction.className === "Hentai",
    );

    /*
     * IMPORTANT:
     *
     * We are NOT rejecting "Sexy" yet.
     *
     * Saree/fashion/model images can legitimately receive
     * a high Sexy score.
     *
     * Start conservatively with Porn/Hentai.
     */

    const pornScore = porn?.probability ?? 0;
    const hentaiScore = hentai?.probability ?? 0;

    const safe = pornScore < 0.7 && hentaiScore < 0.7;

    return {
      safe,
      predictions,
    };
  } finally {
    imageTensor.dispose();
  }
};
