console.log('auth.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');

    function showToast(message, type = 'error') {
        toast.textContent = message;
        toast.className = 'toast ' + type;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
        }, 3000);
    }

    function validateEmail(value) {
        return /^\S+@\S+\.\S+$/.test(value);
    }

    function validatePassword(value) {
        const minLength = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);
        return minLength && hasUpper && hasNumber && hasSpecial;
    }

    function setError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('input-error');
    }

    function clearError(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('input-error');
    }

    function clearAllErrors(form) {
        form.querySelectorAll('input').forEach(clearError);
    }

   const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            clearAllErrors(this);
            let isValid = true;

            const name = document.getElementById('registerName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const confirmPassword = document.getElementById('registerConfirmPassword');

            const nameValue = name.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value;
            const confirmValue = confirmPassword.value;

            if (nameValue.length < 3) {
                setError(name, 'Nome deve ter pelo menos 3 caracteres.');
                isValid = false;
            }

            if (!validateEmail(emailValue)) {
                setError(email, 'Insira um e-mail válido.');
                isValid = false;
            }

            if (!validatePassword(passwordValue)) {
                setError(password, 'Senha deve ter 8+ caracteres, maiúscula, número e símbolo.');
                isValid = false;
            }

            if (passwordValue !== confirmValue) {
                setError(confirmPassword, 'As senhas precisam coincidir.');
                isValid = false;
            }

            if (!isValid) {
                showToast('Preencha o formulário de cadastro conforme os requisitos.', 'error');
                return;
            }

            try {
                const response = await fetch('/cadastro', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                     body: new URLSearchParams({ username: nameValue, email: emailValue, senha: passwordValue })
                });

                const data = await response.json();

                if (response.ok) {                          
                    showToast(data.message, 'success');
                    setTimeout(() => window.location.href = '/', 1000);
                } else {                                   
                    showToast(data.error, 'error');
                }
            } catch (err) {
                showToast('Erro de conexão. Tente novamente.', 'error');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            clearAllErrors(this);
            let isValid = true;

            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            const emailValue = email.value;
            const passwordValue = password.value;

            if (!emailValue || !validateEmail(emailValue)) {
                setError(email, 'Insira um e-mail válido.');
                isValid = false;
            }

            if (!passwordValue) {
                setError(password, 'Preencha a senha.');
                isValid = false;
            }

            if (!isValid) {
                showToast('Verifique os dados de login.', 'error');
                return;
            }

            try {
                const response = await fetch('/login', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                     body: new URLSearchParams({ email: emailValue, senha: passwordValue })
                });
                
                if (response.ok) {                          
                    const data = await response.json();
                    showToast(data.message, 'success');
                    setTimeout(() => window.location.href = '/dashboard', 1000);
                } else {                                   
                    showToast(data.error, 'error');
                }
            } catch (err) {
                showToast('Erro de conexão. Tente novamente.', 'error');
            }
        });
    }
});