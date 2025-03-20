import { createContext, useState } from "react";
import runChat from "../config/MyAi";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delaypara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");     
        setRecentPrompt("");   
        setInput("");
    };
    


    const onSent = async (prompt, isFromRecent = false) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let userInput = prompt ?? input;
        setRecentPrompt(userInput);

        if (!isFromRecent) {// Sirf manually likha gaya input hi "Recent" me add ho
            setPrevPrompt((prev) => [...prev, userInput]);
        }

        try {
            let response = await runChat(userInput);

            let formattedResponse = response
                .split("**")
                .map((part, i) => (i % 2 === 1 ? `<b>${part}</b>` : part))
                .join("");

            formattedResponse = formattedResponse.replace(/\*/g, "</br>");
            let words = formattedResponse.split(" ");

            words.forEach((word, i) => delaypara(i, word + " "));

        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setLoading(false);
        setInput("");
    };

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
