import { UserContext, Themes, Pollen, Language } from "../user-context";

export var USERCONTEXT: UserContext = {
    theme: Themes.Light,
    fontSize: 62.5,
    pollen: [Pollen.Ambrosia, Pollen.Graeser],
    selfVoicingEnabled: true,
    language: Language["de-DE"],
    doVentilationReminder: true, 
    reduceMotion: true,
}