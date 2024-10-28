// Função para lidar com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/usuarios'); // URL do servidor
        const usuarios = await response.json();

        // Verifica se o usuário existe
        const usuarioEncontrado = usuarios.find(usuario => usuario.login === login && usuario.senha === senha);

        if (usuarioEncontrado) {
            // Armazenar dados do usuário logado no localStorage
            localStorage.setItem('loggedUser', JSON.stringify(usuarioEncontrado));
            // Redirecionar para a página de perfil
            window.location.href = 'perfil.html';
        } else {
            document.getElementById('message').innerText = 'Login ou senha incorretos.';
            document.getElementById('message').classList.add('text-danger');
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
});
