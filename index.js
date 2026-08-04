// Form elements
var firstName = document.querySelector("#first-name");
var lastName = document.querySelector("#last-name");
var email = document.querySelector("#email");
var message = document.querySelector("#message");
var form = document.querySelector(".contact-form");

// Event listeners for form validation
firstName.addEventListener("input", checkFirstName);
lastName.addEventListener("input", checkLastName);
email.addEventListener("input", checkEmail);
message.addEventListener("input", checkMessage);
form.addEventListener("submit", validateForm);

function checkFirstName() {
    if (this.value.length < 3) {
        this.style.backgroundColor = "lightcoral";
        this.style.borderColor = "red";
    } else {
        this.style.backgroundColor = "white";
        this.style.borderColor = "#ccc";
    }
}

function checkLastName() {
    if (this.value.length < 3) {
        this.style.backgroundColor = "lightcoral";
        this.style.borderColor = "red";
    } else {
        this.style.backgroundColor = "white";
        this.style.borderColor = "#ccc";
    }
}

function checkEmail() {
    var reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!reg.test(this.value)) {
        this.style.backgroundColor = "lightcoral";
        this.style.borderColor = "red";
    } else {
        this.style.backgroundColor = "white";
        this.style.borderColor = "#ccc";
    }
}

function checkMessage() {
    if (this.value.length < 5) {
        this.style.backgroundColor = "lightcoral";
        this.style.borderColor = "red";
    } else {
        this.style.backgroundColor = "white";
        this.style.borderColor = "#ccc";
    }
}
async function validateForm(e) {
    e.preventDefault();
    
    // Reset all backgrounds first
    firstName.style.backgroundColor = "white";
    lastName.style.backgroundColor = "white";
    email.style.backgroundColor = "white";
    message.style.backgroundColor = "white";
    
    firstName.style.borderColor = "#ccc";
    lastName.style.borderColor = "#ccc";
    email.style.borderColor = "#ccc";
    message.style.borderColor = "#ccc";
    
    // Validate each field
    var reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var firstNameValid = firstName.value.trim().length >= 3;
    var lastNameValid = lastName.value.trim().length >= 3;
    var emailValid = reg.test(email.value.trim());
    var messageValid = message.value.trim().length >= 5;
    
    if (!firstNameValid) {
        firstName.style.backgroundColor = "lightcoral";
        firstName.style.borderColor = "red";
    }
    if (!lastNameValid) {
        lastName.style.backgroundColor = "lightcoral";
        lastName.style.borderColor = "red";
    }
    if (!emailValid) {
        email.style.backgroundColor = "lightcoral";
        email.style.borderColor = "red";
    }
    if (!messageValid) {
        message.style.backgroundColor = "lightcoral";
        message.style.borderColor = "red";
    }
    
    // If all fields are valid
    if (firstNameValid && lastNameValid && emailValid && messageValid) {
        // Send data to server
        await sendFormDataToServer();
    } else {
        alert("Please fill all fields correctly.");
    }
}

async function sendFormDataToServer() {
    try {
        const submitBtn = document.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;
        const formData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            message: message.value.trim()
        };
        
        console.log("Sending contact form data:", formData);
        
        // Send POST request to server
        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.error("Error parsing response:", parseError);
            throw new Error("Server response error");
        }
        
        console.log("Server response:", response.status, result);
        
        if (response.ok && result.success) {
            // Show success message
            showSuccessMessage();
            
            // Clear the form
            form.reset();
            
            firstName.style.backgroundColor = "white";
            lastName.style.backgroundColor = "white";
            email.style.backgroundColor = "white";
            message.style.backgroundColor = "white";
            
            firstName.style.borderColor = "#ccc";
            lastName.style.borderColor = "#ccc";
            email.style.borderColor = "#ccc";
            message.style.borderColor = "#ccc";
            
        } else {
            const errorMsg = result.message || "Failed to submit form. Please try again.";
            alert(errorMsg);
        }
        
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Network error. Please check your connection and try again.");
    } finally {
        const submitBtn = document.querySelector(".submit-btn");
        submitBtn.textContent = "SUBMIT";
        submitBtn.disabled = false;
    }
}

function showSuccessMessage() {
    // Remove existing message if any
    const existingMessage = document.getElementById('success-message-container');
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }
    
    const messageContainer = document.createElement('div');
    messageContainer.id = 'success-message-container';
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "0";
    messageContainer.style.left = "0";
    messageContainer.style.width = "100%";
    messageContainer.style.height = "100%";
    messageContainer.style.background = "rgba(0, 0, 0, 0.8)";
    messageContainer.style.display = "flex";
    messageContainer.style.justifyContent = "center";
    messageContainer.style.alignItems = "center";
    messageContainer.style.zIndex = "99999";
    messageContainer.style.fontFamily = "'Roboto', sans-serif";
    
    const messageBox = document.createElement('div');
    messageBox.style.background = "white";
    messageBox.style.padding = "40px 30px";
    messageBox.style.borderRadius = "10px";
    messageBox.style.textAlign = "center";
    messageBox.style.maxWidth = "450px";
    messageBox.style.width = "85%";
    messageBox.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
    
    const icon = document.createElement('div');
    icon.innerHTML = `
        <div style="
            width: 80px;
            height: 80px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 40px;
        ">
            ✓
        </div>
    `;
    
    const heading = document.createElement('h2');
    heading.textContent = 'Form Submitted Successfully!';
    heading.style.color = "#333";
    heading.style.marginBottom = "15px";
    heading.style.fontFamily = "'Playfair Display', serif";
    heading.style.fontSize = "24px";
    
    const messageText = document.createElement('p');
    messageText.textContent = 'Thank you for contacting CrumbLab. Your data has been saved to our database. We will get back to you within 24 hours.';
    messageText.style.color = "#555";
    messageText.style.marginBottom = "25px";
    messageText.style.fontFamily = "'Roboto', sans-serif";
    messageText.style.lineHeight = "1.6";
    messageText.style.fontSize = "16px";
    
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.background = "#4CAF50";
    okButton.style.color = "white";
    okButton.style.border = "none";
    okButton.style.padding = "12px 35px";
    okButton.style.borderRadius = "5px";
    okButton.style.cursor = "pointer";
    okButton.style.fontSize = "16px";
    okButton.style.fontFamily = "'Roboto', sans-serif";
    okButton.style.marginTop = "10px";
    
    okButton.addEventListener('click', function() {
        document.body.removeChild(messageContainer);
    });
    
    // Also close when clicking outside the message box
    messageContainer.addEventListener('click', function(e) {
        if (e.target === messageContainer) {
            document.body.removeChild(messageContainer);
        }
    });
    
    messageBox.appendChild(icon);
    messageBox.appendChild(heading);
    messageBox.appendChild(messageText);
    messageBox.appendChild(okButton);
    messageContainer.appendChild(messageBox);
    
    document.body.appendChild(messageContainer);
        okButton.focus();
}

function lazyLoadImages() {
    const images = document.querySelectorAll("img");
    for (let img of images) {
        if (img.dataset.src) {
            if (img.offsetTop < (window.innerHeight + window.pageYOffset)) {
                img.src = img.dataset.src; 
                img.removeAttribute("data-src"); 
            }
        }
    }
}

document.addEventListener("scroll", lazyLoadImages);
window.addEventListener("resize", lazyLoadImages);
window.addEventListener("orientationchange", lazyLoadImages);

lazyLoadImages();