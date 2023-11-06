import {FormEvent, useRef, useState} from 'react';
import {object} from "yup";

interface Options<T> {
    initialState ?: Partial<T>,
    validateSchema : ReturnType<typeof object>
    mode : "onSubmit" | "onChange"
}
function useForm<T extends Object>(options : Options<T>) {
    const currentImmutableRef = useRef<T>(options.initialState as T);
    const [formData] = useState<T>(options.initialState as T);
    const [isIdle , setIsIdle] = useState(true);
    const [isValid , setIsValid] = useState(false);
    const [errors , setErrors] = useState<Array<string>>([]);

    const checkFormValidation = () => {
        if(isIdle) setIsIdle(false)
        return options.validateSchema.validate(currentImmutableRef.current)
            .then(() => {
                setIsValid(true);
                setErrors([]);
                return true
            })
            .catch((err) => {
                setIsValid(false)
                setErrors(err.errors);
                return false
            })
    };

    const control = (inputName : keyof T) => {
        return {
            onChange : (e : React.ChangeEvent<HTMLInputElement>) => {
                currentImmutableRef.current = {
                    ...currentImmutableRef.current,
                    [inputName] : e.target.value
                }
                if(options.mode === "onChange") checkFormValidation().then()
            },
        }
    }

    const onSubmit = (callbackFn : (formData : T) => void) => {
        return (e : FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();

            checkFormValidation().then((result) => {
                if(result) callbackFn(currentImmutableRef.current);
            })
        }
    }

    return { formData, errors, isValid , isIdle , control , onSubmit};
}

export default useForm;
