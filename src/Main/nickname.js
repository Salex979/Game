const params = new URLSearchParams(window.location.search);
        const user = params.get("username");
    
        const display = document.getElementById("nickname-display");
        if (user) {
            display.textContent = user;
        } else {
            display.textContent = "Гость";
        }