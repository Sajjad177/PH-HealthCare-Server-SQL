// Function to pick specific keys from an object for filtering purposes
//* ----------- Module 57-7 ----------- *//
const pick = <T extends object>(obj: T, keys: (keyof T)[]): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (key in obj) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

export default pick;