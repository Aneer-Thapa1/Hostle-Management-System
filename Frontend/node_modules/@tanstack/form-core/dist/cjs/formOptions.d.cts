import { Validator } from './types.cjs';
import { FormOptions } from './FormApi.cjs';
export declare function formOptions<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(defaultOpts?: FormOptions<TFormData, TFormValidator>): FormOptions<TFormData, TFormValidator> | undefined;
