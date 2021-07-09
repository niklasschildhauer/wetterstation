export interface UserContext {
    theme: Themes,
    fontSize: number, // in %
    pollen: string[], // Um die Mockdaten einfacher zu erstellen in Array konvertiert. Kann auch wieder in Map<Pollen, boolean> gewandelt werden.
    selfVoicingEnabled: boolean,
    doVentilationReminder: boolean, // TODO: What if multiple users have concurring settings here?
    reduceMotion: boolean, // New element: For people with vestibular disorders is animation triggerd by scrolling not good.
};

export interface UserIdentifikation {
    token: string,
    id: number,
}

export enum Themes {
    Light,
    Dark,
    Automatic,
    HighContrast
};

export interface PollenType {
    id: number,
    pollenName: string
};

export enum Language {
    'de-DE',
    'en-EN'
};

export const INITIAL_USER_CONTEXT: UserContext = {
    theme: Themes.Automatic,
    fontSize: 62.5,
    pollen: [],
    selfVoicingEnabled: false,
    doVentilationReminder: false,
    reduceMotion: false,
};

export const INITIAL_USER_IDENTIFIKATION: UserIdentifikation = {
    token: '',
    id: -99,
};

