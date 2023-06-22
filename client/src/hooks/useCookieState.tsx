import {useCookies} from "react-cookie";
import {CookieStateProps} from "../global";

export const useCookieState = ({key, value} : CookieStateProps) : any => {
    const [cookies, setCookies] = useCookies([key])

    const setCookie = ()=> {
        setCookies(key, value)
    }
    if(key && value) {
        setCookie()
    }
    return cookies[key]
}
