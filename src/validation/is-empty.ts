

export const isEmpty = (value: any) => 
    !value
    || (typeof value === 'object' && Object.keys(value).length === 0);
