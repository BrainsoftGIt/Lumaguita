"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchIgnore = void 0;
const database_service_1 = require("../../../service/database.service");
const zoo_pg_1 = require("zoo.pg");
const enuns_1 = require("../../../lib/cluster/enuns");
function branchIgnore(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
        let branchList = (yield (0, zoo_pg_1.catchAll)(sql `select * from tweeks.branch`)).rows;
        sql = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql;
        let clusters = (yield (0, zoo_pg_1.catchAll)(sql `select * from cluster.cluster`)).rows;
        sql = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql;
        let child = (yield (0, zoo_pg_1.catchAll)(sql `
          select c.*
            from cluster.cluster c
            where c.cluster_identifier = ${req.request.cluster_identifier}
              and c.cluster_type = ${enuns_1.ClusterType.CHILD}
        ;`)).rows.find((value, index) => index === 0);
        return { branchList, clusters, child };
    });
}
exports.branchIgnore = branchIgnore;
//# sourceMappingURL=branch.ignore.js.map