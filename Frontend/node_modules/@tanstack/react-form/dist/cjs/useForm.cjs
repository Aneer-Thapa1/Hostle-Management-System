"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const formCore = require("@tanstack/form-core");
const reactStore = require("@tanstack/react-store");
const react = require("react");
const useField = require("./useField.cjs");
const useIsomorphicLayoutEffect = require("./useIsomorphicLayoutEffect.cjs");
function useForm(opts) {
  const [formApi] = react.useState(() => {
    const api = new formCore.FormApi(opts);
    const extendedApi = api;
    extendedApi.Field = function APIField(props) {
      return /* @__PURE__ */ jsxRuntime.jsx(useField.Field, { ...props, form: api });
    };
    extendedApi.useField = (props) => useField.useField({ ...props, form: api });
    extendedApi.useStore = (selector) => {
      return reactStore.useStore(api.store, selector);
    };
    extendedApi.Subscribe = (props) => {
      return formCore.functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        reactStore.useStore(api.store, props.selector)
      );
    };
    return extendedApi;
  });
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(formApi.mount, []);
  formApi.useStore((state) => state.isSubmitting);
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(() => {
    formApi.update(opts);
  });
  return formApi;
}
exports.useForm = useForm;
//# sourceMappingURL=useForm.cjs.map
