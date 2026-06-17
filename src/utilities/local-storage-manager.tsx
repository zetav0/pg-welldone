export const LocalStorageKeys = {
    REFRESH_TOKEN: "refreshToken",
    TOKEN: "token",
} as const;

export type LocalStorageKeys = typeof LocalStorageKeys[keyof typeof LocalStorageKeys];

export const saveInLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

export const getInLocalStorage = (key: string) => {
    const result = localStorage.getItem(key);
    return !!result && result;
};

export const clearLocalStorage = () => {
    localStorage.clear();
};
