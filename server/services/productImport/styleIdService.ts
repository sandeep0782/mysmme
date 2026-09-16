import Counter from "../../models/Counter";

export const generateStyleId = async (): Promise<number> => {
  const existingCounter = await Counter.findOne({
    name: "productStyleId",
  });

  if (!existingCounter) {
    const newCounter = await Counter.create({
      name: "productStyleId",
      sequence: 30000001,
    });

    return newCounter.sequence;
  }

  existingCounter.sequence += 1;
  await existingCounter.save();

  return existingCounter.sequence;
};
