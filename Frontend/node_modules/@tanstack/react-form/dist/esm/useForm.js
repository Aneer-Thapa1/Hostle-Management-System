import { jsx } from "react/jsx-runtime";
import { FormApi, functionalUpdate } from "@tanstack/form-core";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";
import { Field, useField } from "./useField.js";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";
function useForm(opts) {
  const [formApi] = useState(() => {
    const api = new FormApi(opts);
    const extendedApi = api;
    extendedApi.Field = function APIField(props) {
      return /* @__PURE__ */ jsx(Field, { ...props, form: api });
    };
    extendedApi.useField = (props) => useField({ ...props, form: api });
    extendedApi.useStore = (selector) => {
      return useStore(api.store, selector);
    };
    extendedApi.Subscribe = (props) => {
      return functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStore(api.store, props.selector)
      );
    };
    return extendedApi;
  });
  useIsomorphicLayoutEffect(formApi.mount, []);
  formApi.useStore((state) => state.isSubmitting);
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts);
  });
  return formApi;
}
export {
  useForm
};
//# sourceMappingURL=useForm.js.map
