import { createContext,useContext,useState } from 'react';
const LanguageContext=createContext(null);
const languages=['English','हिन्दी','বাংলা','मराठी','தமிழ்','తెలుగు','ગુજરાતી','ਪੰਜਾਬੀ'];
export function LanguageProvider({children}) { const [language,setLanguage]=useState(localStorage.getItem('settle_language')||'English'); const changeLanguage=l=>{setLanguage(l);localStorage.setItem('settle_language',l)}; return <LanguageContext.Provider value={{language,languages,changeLanguage}}>{children}</LanguageContext.Provider> }
export const useLanguage=()=>useContext(LanguageContext);
