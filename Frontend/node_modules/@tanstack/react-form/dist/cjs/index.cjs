"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const formCore = require("@tanstack/form-core");
const useForm = require("./useForm.cjs");
const useField = require("./useField.cjs");
const useTransform = require("./useTransform.cjs");
exports.useForm = useForm.useForm;
exports.Field = useField.Field;
exports.useField = useField.useField;
exports.useTransform = useTransform.useTransform;
Object.keys(formCore).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => formCore[k]
  });
});
//# sourceMappingURL=index.cjs.map
