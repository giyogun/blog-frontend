import { useReducer } from "react";

const initialState = { value: "", inputFieldIsTouched: false };

const inputReducer = (state, action) => {
  if (action.type === "CHANGE") {
    return {
      value: action.payload,
      inputFieldIsTouched: state.inputFieldIsTouched,
    };
  }
  if (action.type === "BLUR") {
    return { value: state.value, inputFieldIsTouched: true };
  }
  if (action.type === "RESET") {
    return { value: "", inputFieldIsTouched: false };
  }

  if (action.type === "SUBMIT") {
    return { value: state.value, inputFieldIsTouched: true };
  }

  return state;
};

const useClientVal = (validateValue) => {
  const [inputState, dispatchFunc] = useReducer(inputReducer, initialState);

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.inputFieldIsTouched;

  const inputChangeHandler = (e) => {
    dispatchFunc({ type: "CHANGE", payload: e.target.value });
  };

  const inputBlurHandler = (e) => {
    dispatchFunc({ type: "BLUR" });
  };

  const reset = () => {
    dispatchFunc({ type: "RESET" });
  };

  const submit = () => {
    dispatchFunc({ type: "SUBMIT" });
  };

  return {
    value: inputState.value,
    hasError,
    inputBlurHandler,
    inputChangeHandler,
    validity: valueIsValid,
    reset,
    submit,
  };
};

export default useClientVal;
