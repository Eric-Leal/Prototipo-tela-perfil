const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
const apiUrl = 'http://localhost:3000/usuarios'; // URL do seu servidor JSON
let originalUserData; // Para armazenar os dados originais do usuário

function fillUserData() {
    if (loggedUser) {
        document.getElementById('cfgNome').value = loggedUser.nome;
        document.getElementById('cfgEmail').value = loggedUser.email;
        document.getElementById('cfgTelefone').value = loggedUser.telefone || '';
        document.getElementById('cfgEndereço').value = loggedUser.endereco || '';
        document.getElementById('headerUserName').innerText = loggedUser.nome; // Atualiza o nome no header
        document.getElementById('usuarioNomeCompleto').textContent = loggedUser.nome;
        document.getElementById('profileImage').src = loggedUser.imagem || 'https://via.placeholder.com/100';
    }
}

// Função para habilitar ou desabilitar o modo de edição das informações pessoais
function toggleEditInfo() {
    const inputs = document.querySelectorAll('#cfgNome, #cfgEmail, #cfgTelefone, #cfgEndereço');
    const saveButton = document.getElementById('saveInfoButton');
    const cancelButton = document.getElementById('cancelInfoButton');
    const editButton = document.getElementById('btnInformacoes');

    if (saveButton.style.display === 'none') {
        // Salva os dados originais para possível cancelamento
        originalUserData = {
            nome: document.getElementById('cfgNome').value,
            email: document.getElementById('cfgEmail').value,
            telefone: document.getElementById('cfgTelefone').value,
            endereco: document.getElementById('cfgEndereço').value,
        };

        inputs.forEach(input => input.removeAttribute('disabled'));
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
        editButton.style.display = 'none'; // Esconde o botão "Editar"
    } else {
        inputs.forEach(input => input.setAttribute('disabled', 'disabled'));
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline'; // Mostra o botão "Editar" novamente
    }
}

// Função para cancelar a edição das informações
function cancelEditInfo() {
    document.getElementById('cfgNome').value = originalUserData.nome;
    document.getElementById('cfgEmail').value = originalUserData.email;
    document.getElementById('cfgTelefone').value = originalUserData.telefone;
    document.getElementById('cfgEndereço').value = originalUserData.endereco;

    toggleEditInfo(); // Fecha o modo de edição
}

// Função para salvar as informações pessoais
async function saveProfile() {
    const nome = document.getElementById('cfgNome').value;
    const email = document.getElementById('cfgEmail').value;
    const telefone = document.getElementById('cfgTelefone').value;
    const endereco = document.getElementById('cfgEndereço').value;

    const updatedUser = {
        ...loggedUser,
        nome,
        email,
        telefone,
        endereco,
    };

    localStorage.setItem('loggedUser', JSON.stringify(updatedUser));

    try {
        const response = await fetch(`${apiUrl}/${loggedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        if (!response.ok) throw new Error('Erro ao salvar as informações.');

        alert('Informações salvas com sucesso!');
        location.reload(); // Recarrega a página para mostrar as mudanças
    } catch (error) {
        console.error(error);
        alert('Erro ao salvar as informações.');
    }
}

// Função para habilitar ou desabilitar o modo de edição da senha
function toggleEditPassword() {
    const passwordInputs = document.querySelectorAll('#senhaAtual, #novaSenha, #confirmaSenha');
    const saveButton = document.getElementById('savePasswordButton');
    const cancelButton = document.getElementById('cancelPasswordButton');
    const editButton = document.getElementById('btnSenha');

    if (saveButton.style.display === 'none') {
        passwordInputs.forEach(input => input.removeAttribute('disabled'));
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
        editButton.style.display = 'none'; // Esconde o botão "Editar"
    } else {
        passwordInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline'; // Mostra o botão "Editar" novamente
    }
}

// Função para cancelar a edição da senha
function cancelEditPassword() {
    const passwordInputs = document.querySelectorAll('#senhaAtual, #novaSenha, #confirmaSenha');
    passwordInputs.forEach(input => input.setAttribute('disabled', 'disabled'));

    toggleEditPassword(); // Fecha o modo de edição
}

// Função para salvar a nova senha
async function savePassword() {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
        alert('Por favor, preencha todos os campos de senha.');
        return;
    }

    if (novaSenha !== confirmaSenha) {
        alert('As senhas não conferem!');
        return;
    }

    if (senhaAtual !== loggedUser.senha) {
        alert('A senha atual está incorreta!');
        return;
    }

    const updatedUser = {
        ...loggedUser,
        senha: novaSenha,
    };

    localStorage.setItem('loggedUser', JSON.stringify(updatedUser));

    try {
        const response = await fetch(`${apiUrl}/${loggedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        if (!response.ok) throw new Error('Erro ao salvar a nova senha.');

        alert('Senha atualizada com sucesso!');
        location.reload(); // Recarrega a página para mostrar as mudanças
    } catch (error) {
        console.error(error);
        alert('Erro ao salvar a nova senha.');
    }
}

// Função para habilitar a edição da imagem de perfil
function enableImageEdit() {
    const imageUrlInput = document.getElementById('imageUrl');
    const saveImageButton = document.getElementById('saveImageButton');

    // Verifica se o campo já está visível
    if (imageUrlInput.style.display === 'inline') {
        // Se estiver visível, oculta
        imageUrlInput.style.display = 'none';
        saveImageButton.style.display = 'none';
    } else {
        // Se não estiver visível, mostra
        imageUrlInput.style.display = 'inline';
        saveImageButton.style.display = 'inline';
    }
}

document.getElementById('btnIconeLapis').addEventListener('click', enableImageEdit);
document.getElementById('profileImage').addEventListener('click', enableImageEdit);


// Função para salvar a nova imagem de perfil
function saveProfileImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    if (!imageUrl) {
        alert('Por favor, insira um link de imagem.');
        return;
    }

    document.getElementById('profileImage').src = imageUrl;
    loggedUser.imagem = imageUrl;
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    alert('Imagem de perfil atualizada com sucesso!');
    document.getElementById('imageUrl').style.display = 'none';
    document.getElementById('saveImageButton').style.display = 'none';
}

// Chama a função para preencher os dados do usuário ao carregar a página
window.onload = fillUserData;

document.getElementById('logoutButton').onclick = function() {
    localStorage.removeItem('loggedUser'); // Remove os dados do usuário logado
    window.location.href = 'login.html'; // Redireciona para a página de login
};