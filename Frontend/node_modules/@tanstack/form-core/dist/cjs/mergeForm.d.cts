import { FormApi } from './FormApi.cjs';
import { Validator } from './types.cjs';
import { NoInfer } from './util-types.cjs';
/**
 * @private
 */
export declare function mutateMergeDeep(target: object, source: object): object;
export declare function mergeForm<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(baseForm: FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>, state: Partial<FormApi<TFormData, TFormValidator>['state']>): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>;
