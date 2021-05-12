export interface UserContext {
    theme: Themes,
    fontSize: number, // in %
    pollen: Pollen[], // Map<Pollen, boolean> Um die Mockdaten einfacher zu erstellen in Array konvertiert. Kann auch wieder in Map<Pollen, boolean> gewandelt werden. 
    selfVoicingEnabled: boolean,
    language: Language, // ietf-bcp47
    doVentilationReminder: boolean, // TODO: What if multiple users have concurring settings here?
    //simpleLanguage: boolean, //TODO: Is this neccessary? Because we have few text elements in the UI.
    reduceMotion: boolean, // New element: For people with vestibular disorders is animation triggerd by scrolling not good.
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

// FIXME: Klasse macht wrs mehr sinn
export let INITIAL_USER_CONTEXT: UserContext = {
    theme: Themes.Automatic,
    fontSize: 62.5,
    pollen: [Pollen.Ambrosia, Pollen.Graeser],
    selfVoicingEnabled: true,
    language: Language["de-DE"],
    doVentilationReminder: true,
    reduceMotion: false,
}