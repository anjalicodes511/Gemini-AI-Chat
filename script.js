//apiKey : AIzaSyCZxwoPoO_wIyLWpg72MIUyyC0-bHwFmB8 
// url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCZxwoPoO_wIyLWpg72MIUyyC0-bHwFmB8 

document.addEventListener('DOMContentLoaded',()=>{
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");

    // Auto-resize the textarea
    userInput.addEventListener('input',()=>{
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + "px";
    });

    //Actual logic for chat form 
    chatForm.addEventListener('submit',async (e)=>{
        // Prevent browser default from reloading
        e.preventDefault();

        const message = userInput.value.trim();
        if(!message) return;

        //! Todo: Add user message to chat
        addMessage(message,true);

        // Clear user input
        userInput.value = "";
        userInput.style.height = 'auto';
        sendButton.disabled = true;

        //! Todo: Show typing 
        const typingIndicator = showTypingIndicator();
        try{
            //! Todo: Generate response function
            const response = await generateResponse(message);
            typingIndicator.remove();
            //! Add AI response 
            addMessage(response,false);
        }
        catch(error){
            typingIndicator.remove();
            addErrorMessage(error.message);
        }
        finally{
            sendButton.disabled = false;
        }
    });


    //! Generate response 
    async function generateResponse(promt){
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCZxwoPoO_wIyLWpg72MIUyyC0-bHwFmB8`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    contents:[
                        {
                            parts:[
                                {
                                    text:promt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if(!response.ok){
            throw new Error("Failed to generate the response");
        }

        const data = await response.json();
        // console.log(data.candidates[0].content.parts[0].text);
        return data.candidates[0].content.parts[0].text;

    }

    //! Add user message to the chat 
    function addMessage(text,isUser){
        const message = document.createElement("div");
        message.className = `message ${isUser ? 'user-message' : ''}`;
        message.innerHTML = `
            <div class="avatar ${isUser ? 'user-avatar' : ''}">
                ${isUser ? 'U' : 'AI'}
            </div>
            <div class="message-content">${text}</div>
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    }

    //! Show indicator 
    function showTypingIndicator(){
        const indicator = document.createElement("div");
        indicator.className = 'message';
        indicator.innerHTML = `
        <div class="avatar">AI</div>
        <div class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    //! Error Message Function 
    function addErrorMessage(text){
        const message = document.createElement("div");
        message.className = 'message';
        message.innerHTML = `
        <div class="avatar">AI</div>
        <div class="message-content" style="color:res">
            Error: ${text}
        </div>
        `;
        chatMessages.appendChild(message); 
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

