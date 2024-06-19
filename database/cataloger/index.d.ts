import { db } from "kitres";
import tns from "./tns";
import cns from "./cns";
import rns from "./rns";
import fns from "./fns";
import dfns from "./dfns";
import mfns from "./mfns";
import tfns from "./tfns";
import def from "./def";
import mns from "./mns";
import ens from "./ens";
import tmns from "./tmns";
import emns from "./emns";

namespace maguita {
  export type SchemasOf<T extends { [K in tns.TypeProperties]?: T[K] }> =
    | keyof fns.FunctionMap
    | keyof tns.TypeOfMaps<T>
    | keyof rns.TableMaps<T>
    | keyof rns.ViewMaps<T>
    | keyof rns.CompositeMaps<T>
    | keyof ens.EnumMaps<T>
    | keyof mns.EnumMaps<T>
    | keyof tmns.EnumMaps<T>
    | keyof emns.EnumMaps<T>
    | keyof rns.MaterializeMaps<T>;

  export type ResourcesOf<T extends { [K in tns.TypeProperties]?: T[K] }> = {
    schemas: SchemasOf<T>[];

    functionsRefs: fns.FunctionRefsMap;
    functions: fns.FunctionMap;

    functionsProps: fns.FunctionProps;
    functionsPropsRefs: fns.FunctionsPropsRefs;

    tablesRefs: rns.TableRefsMaps<T>;
    tables: rns.TableMaps<T>;

    relationsRefs: rns.RelationRefsMaps<T>;
    relations: rns.RelationMaps<T>;

    viewsRefs: rns.ViewRefsMaps<T>;
    views: rns.ViewMaps<T>;

    composites: rns.CompositeMaps<T>;
    compositesRefs: rns.CompositeRefsMaps<T>;

    enumsRefs: mns.EnumRefsMaps;
    enums: mns.EnumMaps;

    materializesRefs: rns.MaterializeRefsMaps<T>;
    materializes: rns.MaterializeMaps<T>;

    types: tns.TypeOfMaps<T>;
  };

  export type TypedSchemaOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = SchemasOf<T>;
  export type TypedCatalogOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.CatalogOf<ResourcesOf<T>>;

  export type TypedFunctionOfOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.FunctionOf<fns.FunctionRefsMap>;
  export type TypedTableOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.TableOf<rns.TableRefsMaps<T>>;
  export type TypedRelationOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.RelationOf<rns.RelationRefsMaps<T>>;
  export type TypedViewOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.ViewOf<rns.ViewRefsMaps<T>>;
  export type TypedMaterializesOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.MaterializesOf<rns.MaterializeRefsMaps<T>>;
  export type TypedCompositeTypeOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.CompositeTypeOf<rns.CompositeRefsMaps<T>>;
  export type TypedEnumOfMaguita<
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = db.EnumOf<rns.EnumRefsMaps<T>>;

  export type SchemaOfMaguita = TypedSchemaOfMaguita<any>;
  export type CatalogOfMaguita = db.CatalogOf<ResourcesOf<any>>;

  export type FunctionOfOfMaguita = TypedFunctionOfOfMaguita<any>;
  export type TableOfMaguita = TypedTableOfMaguita<any>;
  export type RelationOfMaguita = TypedRelationOfMaguita<any>;
  export type ViewOfMaguita = TypedViewOfMaguita<any>;
  export type MaterializesOfMaguita = TypedMaterializesOfMaguita<any>;
  export type CompositeTypeOfMaguita = TypedCompositeTypeOfMaguita<any>;
  export type EnumOfMaguita = TypedEnumOfMaguita<any>;
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}
}

export default maguita;
