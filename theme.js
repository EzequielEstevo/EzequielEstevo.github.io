// Função para alternar o tema
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Salva o tema no localStorage
    localStorage.setItem('theme', newTheme);
    
    // Aplica o tema no documento
    document.documentElement.setAttribute('data-theme', newTheme);
}

// Função para inicializar o tema
function initializeTheme() {
    // Pega o tema salvo ou usa o padrão (dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Inicializa o tema quando o script carregar
document.addEventListener('DOMContentLoaded', initializeTheme);