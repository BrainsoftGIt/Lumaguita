import mns from "./mns";
import tns from "./tns";

namespace emns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}
}

export default emns;
