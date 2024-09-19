import { jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useStore } from "@tanstack/react-store";
import { FieldApi, functionalUpdate } from "@tanstack/form-core";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";
function useField(opts) {
  const [fieldApi] = useState(() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name
    });
    const extendedApi = api;
    extendedApi.Field = Field;
    return extendedApi;
  });
  useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
  useIsomorphicLayoutEffect(() => {
    fieldApi.update(opts);
  });
  useStore(
    fieldApi.store,
    opts.mode === "array" ? (state) => {
      return [state.meta, Object.keys(state.value ?? []).length];
    } : void 0
  );
  return fieldApi;
}
const Field = ({
  children,
  ...fieldOptions
}) => {
  const fieldApi = useField(fieldOptions);
  return /* @__PURE__ */ jsx(Fragment, { children: functionalUpdate(children, fieldApi) });
};
export {
  Field,
  useField
};
//# sourceMappingURL=useField.js.map
