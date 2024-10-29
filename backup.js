document.addEventListener('DOMContentLoaded', function () {
    const usuarioCorrenteJSON = localStorage.getItem('usuarioCorrente');

    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        
        // Preenche as informações do usuário na página
        document.getElementById('headerNomeUsuario').innerText = usuarioCorrente.nome;
        document.getElementById('usuarioPerfil').innerText = usuarioCorrente.nome;
        document.getElementById('cfgNome').value = usuarioCorrente.nome;
        document.getElementById('cfgEmail').value = usuarioCorrente.email;
        document.getElementById('cfgEndereço').value = usuarioCorrente.endereco || "";
        document.getElementById('cfgTelefone').value = usuarioCorrente.telefone || "";
        document.getElementById('imagemPerfil').src = usuarioCorrente.imagem || 'https://via.placeholder.com/100';
    } else {
        alert('Usuário não está logado.');
        window.location.href = 'login.html';
    }
});

// Variável para armazenar dados originais
let originalUserData = {};

// Função para habilitar/disable edição das informações do usuário
function entrarSairInformacoes() {
    const inputs = document.querySelectorAll('#cfgNome, #cfgEmail, #cfgTelefone, #cfgEndereço');
    const botaoEditar = document.getElementById('btnEditarInfo');
    const botaoSalvar = document.getElementById('btnSalvarInfo');
    const botaoCancelar = document.getElementById('btnCancelarInfo');

    if (botaoSalvar.style.display === 'none') {
        originalUserData = {
            nome: document.getElementById('cfgNome').value,
            email: document.getElementById('cfgEmail').value,
            telefone: document.getElementById('cfgTelefone').value,
            endereco: document.getElementById('cfgEndereço').value,
        };

        inputs.forEach(input => input.removeAttribute('disabled'));
        botaoSalvar.style.display = 'inline';
        botaoCancelar.style.display = 'inline';
        botaoEditar.style.display = 'none';
    } else {
        inputs.forEach(input => input.setAttribute('disabled', 'disabled'));
        botaoSalvar.style.display = 'none';
        botaoCancelar.style.display = 'none';
        botaoEditar.style.display = 'inline';
    }
}

// Evento para editar informações
document.getElementById('btnEditarInfo').addEventListener('click', entrarSairInformacoes);

// Função para cancelar a edição
function cancelarEditarInformacoes() {
    document.getElementById('cfgNome').value = originalUserData.nome;
    document.getElementById('cfgEmail').value = originalUserData.email;
    document.getElementById('cfgTelefone').value = originalUserData.telefone;
    document.getElementById('cfgEndereço').value = originalUserData.endereco;

    entrarSairInformacoes();
}

// Evento para cancelar a edição
document.getElementById('btnCancelarInfo').addEventListener('click', cancelarEditarInformacoes);

// Função para salvar as informações do perfil
async function salvarPerfil() {
    const usuarioCorrente = JSON.parse(localStorage.getItem('usuarioCorrente'));
    const nome = document.getElementById('cfgNome').value;
    const email = document.getElementById('cfgEmail').value;
    const telefone = document.getElementById('cfgTelefone').value;
    const endereco = document.getElementById('cfgEndereço').value;
    const imagem = usuarioCorrente.imagem;

    const atualizarUsuario = {
        ...usuarioCorrente,
        nome,
        email,
        telefone,
        endereco,
        imagem,
    };

    localStorage.setItem('usuarioCorrente', JSON.stringify(atualizarUsuario));

    // Aqui você pode enviar as informações para o backend
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(atualizarUsuario),
        });

        if (!response.ok) throw new Error('Erro ao salvar as informações.');

        // Atualiza a interface imediatamente
        document.getElementById('headerNomeUsuario').innerText = nome;
        document.getElementById('usuarioPerfil').innerText = nome;
        document.getElementById('cfgNome').value = nome;
        document.getElementById('cfgEmail').value = email;
        document.getElementById('cfgTelefone').value = telefone;
        document.getElementById('cfgEndereço').value = endereco;
        document.getElementById('imagemPerfil').src = imagem;

        // Desativa o modo de edição
        entrarSairInformacoes();

        alert('Informações salvas com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro ao salvar as informações.');
    }
}

// Evento para salvar informações
document.getElementById('btnSalvarInfo').addEventListener('click', salvarPerfil);

// Funções para edição de senha
function entrarSairSenha() {
    const passwordInputs = document.querySelectorAll('#senhaAtual, #novaSenha, #confirmaSenha');
    const botaosalvar = document.getElementById('btnSalvarSenha');
    const botaocancelar = document.getElementById('btnCancelarSenha');
    const botaoeditar = document.getElementById('btnEditarSenha');

    if (botaosalvar.style.display === 'none') {
        passwordInputs.forEach(input => input.removeAttribute('disabled'));
        botaosalvar.style.display = 'inline';
        botaocancelar.style.display = 'inline';
        botaoeditar.style.display = 'none';
    } else {
        passwordInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
        botaosalvar.style.display = 'none';
        botaocancelar.style.display = 'none';
        botaoeditar.style.display = 'inline';
    }
}

// Evento para editar senha
document.getElementById('btnEditarSenha').addEventListener('click', entrarSairSenha);

// Função para cancelar a edição de senha
function cancelarEdicaoSenha() {
    const passwordInputs = document.querySelectorAll('#senhaAtual, #novaSenha, #confirmaSenha');
    passwordInputs.forEach(input => input.setAttribute('disabled', 'disabled'));

    entrarSairSenha();
}

// Evento para cancelar edição de senha
document.getElementById('btnCancelarSenha').addEventListener('click', cancelarEdicaoSenha);

// Função para salvar nova senha
async function salvarSenha() {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    // Validação de campos
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
        alert('Por favor, preencha todos os campos de senha.');
        return;
    }

    if (novaSenha !== confirmaSenha) {
        alert('As senhas não conferem!');
        return;
    }

    const usuarioCorrente = JSON.parse(localStorage.getItem('usuarioCorrente'));

    if (!usuarioCorrente) {
        alert('Erro: usuário não encontrado.');
        return;
    }

    // Verifica se a senha atual está correta
    if (senhaAtual !== usuarioCorrente.senha) {
        alert('A senha atual está incorreta!');
        return;
    }

    // Atualiza a senha do usuário
    usuarioCorrente.senha = novaSenha;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioCorrente),
        });

        if (!response.ok) throw new Error('Erro ao atualizar a senha.');

        alert('Senha atualizada com sucesso!');
        localStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente)); // Atualiza o localStorage
        location.reload(); // Recarrega a página
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar a senha.');
    }
}

// Evento para salvar senha
document.getElementById('btnSalvarSenha').addEventListener('click', salvarSenha);

// Função para habilitar a edição da imagem de perfil
function editarImagem() {
    const imageUrlInput = document.getElementById('imageUrl');
    const saveImageButton = document.getElementById('btnSalvarImagem');

    if (imageUrlInput.style.display === 'inline') {
        imageUrlInput.style.display = 'none';
        saveImageButton.style.display = 'none';
    } else {
        imageUrlInput.style.display = 'inline';
        saveImageButton.style.display = 'inline';
    }
}

// Evento para editar imagem de perfil
document.getElementById('btnImagemPerfil').addEventListener('click', editarImagem);

// Função para salvar nova imagem de perfil
async function salvarImagemPerfil() {
    const imageUrl = document.getElementById('imageUrl').value;
    if (!imageUrl) {
        alert('Por favor, insira um link de imagem.');
        return;
    }

    const usuarioCorrente = JSON.parse(localStorage.getItem('usuarioCorrente'));
    usuarioCorrente.imagem = imageUrl;

    localStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioCorrente),
        });

        if (!response.ok) throw new Error('Erro ao atualizar a imagem de perfil.');

        document.getElementById('imagemPerfil').src = imageUrl;
        alert('Imagem de perfil atualizada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar a imagem de perfil.');
    }
}

// Evento para salvar imagem de perfil
document.getElementById('btnSalvarImagem').addEventListener('click', salvarImagemPerfil);
