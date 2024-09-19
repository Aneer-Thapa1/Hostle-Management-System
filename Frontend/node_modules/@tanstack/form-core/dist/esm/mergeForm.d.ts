import { FormApi } from './FormApi.js';
import { Validator } from './types.js';
import { NoInfer } from './util-types.js';
/**
 * @private
 */
export declare function mutateMergeDeep(target: object, source: object): object;
export declare function mergeForm<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(baseForm: FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>, state: Partial<FormApi<TFormData, TFormValidator>['state']>): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>;
