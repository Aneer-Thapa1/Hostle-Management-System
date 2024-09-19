import { Validator } from './types.js';
import { FormOptions } from './FormApi.js';
export declare function formOptions<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(defaultOpts?: FormOptions<TFormData, TFormValidator>): FormOptions<TFormData, TFormValidator> | undefined;
