import queryString from "query-string";

export const encodeObjects = (object: any) => {
    const encodedObject: any = {};
    Object.keys(object).forEach((key) => {
        if (typeof object[key] === "object") {
            if (object[key]) {
                if (Object.keys(object[key]).length > 0) {
                    encodedObject[key] = object[key];
                }
            }
        } else {
            if (object[key]) {
                encodedObject[key] = object[key];
            }
        }
    });
    const searchParams = queryString.stringify(encodedObject);
    return searchParams;
};
