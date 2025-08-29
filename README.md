# ProgressoFit - Frontend
### Controle seu treino. Veja seu progresso. Treine com inteligência.

_**Projeto acadêmico em desenvolvimento*_

Este é o frontend da aplicação ProgressoFit, uma plataforma web desenvolvida para oferecer ferramentas simples e poderosas para monitoramento de treinos. A interface permite que os usuários visualizem seu progresso através de gráficos e relatórios, sejam insentivadas com a gameficação de conquistas, e recebam frases motivacionais personalizadas baseadas em inteligência artificial.

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)**:

- **Models (DTOs)**: Estruturas de dados e validações
- **Views**: Renderização de componentes e páginas
- **Controllers**: Lógica de negócio e manipulação de eventos
- **Services**: Comunicação com APIs e manipulação de dados
- **Router**: Gerenciamento de rotas e navegação

## 🔄 Integração com Backend

A aplicação frontend se comunica com o backend através da classe `ApiService`, que gerencia:
- Autenticação via JWT
- Requisições HTTP padronizadas
- Tratamento de erros
- Headers de autenticação automáticos

## 🎯 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação**: Login e cadastro de usuários
- **Controle de Autorização**: Gerenciamento de acesso com tokens JWT
- **Componentes Reutilizáveis**: Arquitetura baseada em componentes
- **Bootstrap customizado**: Uso de Sass/SCSS

---

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- 🟢 **Node.js** (versão 16 ou superior)
- 📦 **NPM**
- 🔧 **Git**

### Verificando as versões instaladas:

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do NPM
npm --version

# Verificar versão do Git
git --version
```

---

## 🛠️ Como executar o projeto

### 1. Clone o repositório
```bash
gh repo clone ViniciusMPonte/ProgressoFit-Frontend
cd ProgressoFit-Frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a URL da API
Certifique-se de que o backend esteja rodando em `http://localhost:8090` ou ajuste a `baseURL` no arquivo `src/service/ApiService.js`:

```javascript
this.baseURL = 'http://localhost:8090'; // Ajuste se necessário
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm start
```

Este comando iniciará o Live Server automaticamente e abrirá a aplicação no navegador.

### 5. Acesse a aplicação
A aplicação estará disponível em: `http://localhost:8080`

----------

## 📋 Customização do Bootstrap - Pré-requisitos

Antes de customizar o Bootstrap, instale as ferramentas necessárias:

```bash
# Instalar Sass globalmente
npm install -g sass

# Instalar PostCSS e Autoprefixer
npm install -g postcss-cli autoprefixer
```

### Verificando as instalações:
```bash
# Verificar Sass
sass --version

# Verificar PostCSS
postcss --version

# Verificar Autoprefixer
autoprefixer --info
```

## 🚀 Setup e Configuração

### 1. Estrutura do projeto Bootstrap
```
./src/styles/bootstrap/
├── bootstrap.scss          # Arquivo principal de customização
├── bootstrap.css           # CSS compilado
├── bootstrap.css.map       
├── package.json           
├── package-lock.json      
└── cheatsheet/           # Documentação visual dos componentes
    ├── index.html
    ├── cheatsheet.css
    ├── cheatsheet.rtl.css
    └── cheatsheet.js
```

### 2. Navegue até o diretório do Bootstrap
```bash
cd src/styles/bootstrap/
```

### 3. Instale as dependências locais
```bash
npm install
```

## ✏️ Como Customizar o Bootstrap

### 1. Editando variáveis SCSS
Abra o arquivo `bootstrap.scss` e personalize as variáveis. Exemplo:

```scss
// === CORES PERSONALIZADAS ===
$primary: #your-brand-color;
$secondary: #your-secondary-color;
$success: #28a745;
$info: #17a2b8;
$warning: #ffc107;
$danger: #dc3545;

// === TIPOGRAFIA ===
$font-family-base: 'Your-Font', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.6;

// === ESPAÇAMENTOS ===
$spacer: 1rem;
$border-radius: 0.5rem;

// === BREAKPOINTS ===
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// Importar Bootstrap
@import "~bootstrap/scss/bootstrap";
```

### 2. Compilando o SCSS
Após fazer suas alterações, compile o arquivo:

```bash
# Comando básico de compilação
sass bootstrap.scss bootstrap.css

# Use --watch para compilar automaticamente a cada alteração
sass --watch bootstrap.scss:bootstrap.css
```

## 📚 Bootstrap Cheatsheet

### Acessando a documentação visual
O projeto inclui uma **cheatsheet completa** dos componentes Bootstrap:

```
URL: /src/styles/bootstrap/cheatsheet/
Arquivo: src/styles/bootstrap/cheatsheet/index.html
```

### Como usar a cheatsheet:

1. **Abra no navegador**:
   ```
   http://localhost:8080/src/styles/bootstrap/cheatsheet/
   ```

2. **O que você encontrará**:
    - 📋 Todos os componentes Bootstrap disponíveis
    - 🎨 Exemplos visuais de cada componente
    - 📝 Código HTML para copiar e colar
    - 🎯 Variações de cada componente
    - 📱 Responsividade e breakpoints
    - 🔧 Classes utilitárias

3. **Navegação**:
    - **Componentes**: Buttons, Cards, Modals, Navbars, etc.
    - **Layout**: Grid system, Flexbox utilities
    - **Utilities**: Spacing, Colors, Typography
    - **Forms**: Input groups, Validation, Controls

### Benefícios da cheatsheet:
- ✅ **Referência rápida** durante o desenvolvimento
- ✅ **Teste visual** das customizações aplicadas
- ✅ **Documentação atualizada** com suas personalizações
- ✅ **Exemplos práticos** de implementação
- ✅ **Verificação de responsividade**

## 🎯 Workflow de Customização

### 1. Desenvolvimento
```bash
#inicie o projeto
npm start

# Entre no diretório em outro terminal
cd src/styles/bootstrap/

# Modo watch para desenvolvimento
sass --watch bootstrap.scss:bootstrap.css

# Comece as alterações no bootstrap.scss
```

### 2. Teste suas mudanças
- Acesse a cheatsheet: `http://localhost:8080/src/styles/bootstrap/cheatsheet/`
- Verifique os componentes modificados
- Teste a responsividade

## 📝 Boas Práticas

### Organização do código SCSS
```scss
// 1. Variáveis personalizadas primeiro
$primary: #your-color;

// 2. Import do Bootstrap
@import "~bootstrap/scss/bootstrap";
```

## 🔧 Comandos Úteis

```bash
# Compilação básica
sass bootstrap.scss bootstrap.css

# Watch mode (recompila automaticamente)
sass --watch bootstrap.scss:bootstrap.css

# Compilação minificada
sass --style compressed bootstrap.scss bootstrap.css

# Com sourcemap
sass --source-map bootstrap.scss bootstrap.css

# Verificar sintaxe
sass --check bootstrap.scss

# Autoprefixer
postcss bootstrap.css --use autoprefixer -o bootstrap.css
```