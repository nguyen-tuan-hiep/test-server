// https://dirask.com/posts/React-change-state-from-props-functional-component-prKRbj
import { useRef, useState } from "react";

export default function usePropState(prop) {
    // eslint-disable-next-line
    const [counter, setCounter] = useState(0);
    const currentPropRef = useRef(prop);
    const currentStateRef = useRef(prop);
    if (currentPropRef.current !== prop) {
        currentPropRef.current = prop;
        currentStateRef.current = prop;
    }
    return [
        currentStateRef.current,
        (newState) => {
            currentStateRef.current = newState;
            setCounter((counter) => counter + 1);
        },
    ];
}
