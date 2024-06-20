import mns from "./mns";
import tns from "./tns";

namespace tmns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}
}

export default tmns;
