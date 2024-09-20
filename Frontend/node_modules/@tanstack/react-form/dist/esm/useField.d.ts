import { FieldApi, DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import { NodeType, UseFieldOptions } from './types.js';
interface ReactFieldApi<TParentData, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined> {
    /**
     * A pre-bound and type-safe sub-field component using this field as a root.
     */
    Field: FieldComponent<TParentData, TFormValidator>;
}
/**
 * A type representing a hook for using a field in a form with the given form data type.
 *
 * A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.
 */
export type UseField<TParentData, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined> = <TName extends DeepKeys<TParentData>, TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined, TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>>(opts: Omit<UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'form'>) => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
/**
 * A hook for managing a field in a form.
 * @param opts An object with field options.
 *
 * @returns The `FieldApi` instance for the specified field.
 */
export declare function useField<TParentData, TName extends DeepKeys<TParentData>, TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined, TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>>(opts: UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & ReactFieldApi<TParentData, TFormValidator>;
/**
 * @param children A render function that takes a field API instance and returns a React element.
 */
type FieldComponentProps<TParentData, TName extends DeepKeys<TParentData>, TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined, TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>> = {
    children: (fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>) => NodeType;
} & UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
/**
 * A type alias representing a field component for a specific form data type.
 */
export type FieldComponent<TParentData, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined> = <TName extends DeepKeys<TParentData>, TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined, TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>>({ children, ...fieldOptions }: Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'form'>) => NodeType;
/**
 * A function component that takes field options and a render function as children and returns a React component.
 *
 * The `Field` component uses the `useField` hook internally to manage the field instance.
 */
export declare const Field: <TParentData, TName extends DeepKeys<TParentData>, TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined, TFormValidator extends Validator<TParentData, unknown> | undefined = undefined, TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>>({ children, ...fieldOptions }: FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) => NodeType;
export {};
