export interface UserContext {
    theme: Themes,
    fontSize: number, // in %
    pollen: Map<Pollen, boolean>,
    selfVoicingEnabled: boolean,
    language: Language, // ietf-bcp47
    doVentilationReminder: boolean, // TODO: What if multiple users have concurring settings here?
    //simpleLanguage: boolean, //TODO: Is this neccessary? Because we have few text elements in the UI.
}

export enum Themes {
    Light,
    Dark,
    Automatic,
    HighContrast
}

export enum Pollen {
    Ambrosia,
    Birke,
    Beifuss,
    Esche,
    Erle,
    Roggen,
    Graeser,
    Hasel
}

export enum Language {
    "de-DE",
    "en-EN"
}