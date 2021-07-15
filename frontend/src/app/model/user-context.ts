/**
 * Model of the user context.
 * It cotains all information which are needed for the personalization
 */
export interface UserContext {
    theme: Themes,
    fontSize: number, // in %
    pollen: string[], // Um die Mockdaten einfacher zu erstellen in Array konvertiert. Kann auch wieder in Map<Pollen, boolean> gewandelt werden.
    selfVoicingEnabled: boolean,
    doVentilationReminder: boolean, // TODO: What if multiple users have concurring settings here?
    reduceMotion: boolean, // New element: For people with vestibular disorders is animation triggerd by scrolling not good.
};

/**
 * Model of the User Identifikation. It contains the token 
 * and user id. These are needed for the identification of the user 
 * by the backend. 
 */
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

/** Empty user context */
export const INITIAL_USER_CONTEXT: UserContext = {
    theme: Themes.Automatic,
    fontSize: 62.5,
    pollen: [],
    selfVoicingEnabled: false,
    doVentilationReminder: false,
    reduceMotion: false,
};

/** Empty user identifikation */
export const INITIAL_USER_IDENTIFIKATION: UserIdentifikation = {
    token: '',
    id: -99,
};

