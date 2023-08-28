import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";
import dotenv from "dotenv";
dotenv.config();

const PAT = process.env.PAT;

const USER_ID = "meta";
const APP_ID = "Llama-2";

const MODEL_ID = "llama2-13b-chat";
const MODEL_VERSION_ID = "79a1af31aa8249a99602fc05687e8f40";

export const nutritionist = async (req, res) => {
  const { nutritionInformation } = req.body;
  const prompt = `<s>[INST] <<SYS>>

    You are a nutritionist. You have knowledge of the effects of nutrients and ingredients of a food or beverage on the body or health.
    
    You will be given nutritional information, ingredients, and a total quantity for a food or beverage, and you have to output the effects of that product on health in a negative manner.
    
    Neutrient information could be given in serving size, not in total quantity; you have to output like a person consuming the total quantity of that food or beverage.
    
    Use FDA recommendations.

    <</SYS>>
    
    ${nutritionInformation}[/INST]`;
  console.log(prompt)

  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  try {
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID,
        inputs: [{ data: { text: { raw: prompt } } }],
      },
      metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }

        if (response.status.code !== 10000) {
          throw new Error(
            "Post model outputs failed, status: " + response.status.description
          );
        }

        const output = response.outputs[0].data.text.raw;

        res.status(200).json({ output });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};
