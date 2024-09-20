import { FormApi, FormTransform, Validator } from '@tanstack/form-core';
export declare function useTransform<TFormData, TFormValidator extends Validator<TFormData, unknown> | undefined = undefined>(fn: (formBase: FormApi<any, any>) => FormApi<TFormData, TFormValidator>, deps: unknown[]): FormTransform<TFormData, TFormValidator>;
