export declare const getDiff: (prev: object | object[] | undefined, cur: object | object[] | undefined) => {
    [path: string]: string | number;
} | ({
    [path: string]: string | number;
} | null)[] | null;
