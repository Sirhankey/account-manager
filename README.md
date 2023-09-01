# AccountManager - Admin Dashboard

O AccountManager é um projeto de administração de contas desenvolvido em TypeScript que utiliza o AdminJS como painel de administração. Este projeto permite que você gerencie contas, categorias, grupos, status e métodos de pagamento.

## Requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas e tecnologias instaladas:

- [Node.js](https://nodejs.org/) (v16.20.2)
- [MariaDB](https://mariadb.org/) (ou outro banco de dados relacional)
- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) (opcional, mas recomendado)

## Configuração do Banco de Dados

1. Crie um banco de dados no MariaDB para o AccountManager.
2. Edite o arquivo `.env` na raiz do projeto e configure as variáveis de ambiente relacionadas ao banco de dados:
```
PORT_HOST =
HOST = ''
DB_PASS = ''
DB_USER = ''
DB_NAME = ''
DB_HOST = ''
DB_PORT = 

EMAIL_USER = ''
EMAIL_PASS = ''
EMAIL_PORT = 
EMAIL_HOST = ''
```

## Instalação

1. Clone este repositório:

```bash
git clone https://github.com/Sirhankey/account-manager.git
```

Navegue até o diretório do projeto:
```bash
cd account-manager
```
Instale as dependências:
```bash
yarn install
```
Execute as migrações do banco de dados para criar as tabelas:
```bash
yarn sequelize db:migrate
```
Caso não consiga rodar as migrations, seguir o seguinte passo na 
TODO list do projeto:
```bash
[!] TODO: Caso as migrations não funcionem, ... 
```
Inicie o servidor de desenvolvimento:
```bash
tsx watch app.ts
```
### Recursos Adicionais

### Envio de Emails
O projeto utiliza o Nodemailer para enviar e-mails, por exemplo, para notificar sobre novas contas ou pagamentos pendentes.

### Contribuindo
Sinta-se à vontade para contribuir com este projeto abrindo problemas (issues) ou enviando pull requests. Esperamos que este projeto seja útil e estamos ansiosos para ver suas contribuições.

### Licença
Este projeto está licenciado sob a Licença MIT.

