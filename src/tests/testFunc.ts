const assert = (fun, input, expected) => {
    return fun(input) === expected ?
        'passed' :
        `failed on input=${input}. expected ${expected}, but got ${fun(input)}`;
}