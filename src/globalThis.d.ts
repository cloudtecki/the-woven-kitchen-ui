interface CustomGlobalThis {
    apiUrl: string;
    apiScope: string;
    clientId: string;
    authority: string;
    baseUrl: string;
}

declare global {
    var twkVars: CustomGlobalThis;
}
export { }; // This is mandatory to make the file a module