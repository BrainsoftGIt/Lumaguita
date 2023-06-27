"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const bodyParser = require('body-parser');
index_1.app.use(bodyParser.json({}));
index_1.app.use(bodyParser.urlencoded({ extended: true }));
index_1.app.use(bodyParser.raw({}));
index_1.app.use(bodyParser.text({}));
//# sourceMappingURL=body-parser.js.map