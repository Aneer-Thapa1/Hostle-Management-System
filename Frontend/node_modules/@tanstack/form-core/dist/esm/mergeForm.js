function mutateMergeDeep(target, source) {
  const targetKeys = Object.keys(target);
  const sourceKeys = Object.keys(source);
  const keySet = /* @__PURE__ */ new Set([...targetKeys, ...sourceKeys]);
  for (const key of keySet) {
    const targetKey = key;
    const sourceKey = key;
    if (Array.isArray(target[targetKey]) && Array.isArray(source[sourceKey])) {
      target[targetKey] = [
        ...target[targetKey],
        ...source[sourceKey]
      ];
    } else if (typeof target[targetKey] === "object" && typeof source[sourceKey] === "object") {
      mutateMergeDeep(target[targetKey], source[sourceKey]);
    } else {
      if (!(sourceKey in source) && source[sourceKey] === void 0) {
        continue;
      }
      target[targetKey] = source[sourceKey];
    }
  }
  return target;
}
function mergeForm(baseForm, state) {
  mutateMergeDeep(baseForm.state, state);
  return baseForm;
}
export {
  mergeForm,
  mutateMergeDeep
};
//# sourceMappingURL=mergeForm.js.map
