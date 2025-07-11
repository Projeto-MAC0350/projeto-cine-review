# Projeto rev.usp
Repositório para o desenvolvimento do projeto da disciplina MAC0350 - Introdução ao Desenvolvimento de Sistemas de Software do Bacharelado em Ciência da Computação do IME-USP, ministrada pelo professor Paulo Meirelles.

# Descrição
O projeto rev.usp visa concentrar opiniões de espectadores sobre filmes, direcionado principalmente para os filmes exibidos no CINUSP. Além disso, exibir um panorama geral sobre as opiniões dos usuários na página de cada filme e mostrar sessões disponíveis, no caso de haver alguma.

# Linguagem de Programação
- **Frontend:** Angular
- **Backend:** Kotlin
- **Banco de dados:** PostgreSQL + Exposed

# Funcionalidades
- Sistema de Cadastro e Login usando tokens JWT
- Página com todos os filmes expostos no CINUSP nos últimos três anos
- Páginas individuais de cada filme, incluindo imagem sinopse e reviews
- Páginas individuais de usuários contendo suas reviews
- Agenda da semana com local, horário, duração e imagem de cada filme
- Página de perfil do usuário logado, contendo suas reviews

# Como executar localmente
1. Instalar dependências
- Assumindo que a máquina já possui python 3 e um shell bash:
``` bash
sudo apt update && sudo apt install -y \
  openjdk-17-jdk \
  gradle \
  nodejs \
  npm \
  postgresql \
  postgresql-contrib
  
sudo apt install python3-pip  
pip install psycopg2-binary
```
- É necessário ajustar a versão do npm (20 ou superior):
``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install --lts
rm -rf node_modules package-lock.json
npm install
```
2. Criar o banco de dados
- Primeiro, iniciamos o serviço do postgres e abrimos em superusuário
```bash
sudo service postgresql start
sudo -u postgres psql
```
- Depois, no console do SQL, criamos o usuário e a database:
``` sql
CREATE ROLE cine_admin WITH LOGIN PASSWORD 'senha6871';
CREATE DATABASE cine_review WITH OWNER cine_admin;
```

- Para sair, basta inserir:
``` sql
\q
```
3. Preencher o banco de dados com os dados obtidos no webscraping do site do CINUSP
- Para isso, navegue até a pasta de banco de dados no diretório do projeto e execute:
```bash
python3 criadb.py
python3 populatesessions.py
```

4. Inicializar o backend
- Navegue até backend/ e execute:
```bash
./gradlew run
```

5. Inicializar o frontend
- Sem encerrar a execução do backend, vá até frontend/ e execute:
```bash
ng serve
```
# Testes
1. Frontend
- Para rodar os testes automatizados no frontend, navegue até o diretório frontend/ e execute o comando abaixo, que irá abrir uma aba no navegador com o log dos testes.
```bash
npm test
```

# Observações
- O frontend rodará em localhost:4200 e o backend em localhost:8080, de modo que esses endereços devem estar disponíveis
- O PostgreSQL está configurado para utilizar a porta 5432, que também deve estar disponível
- O script utilizado para WebScraping disponibilizado funciona e foi utilizado, no entando os dados precisaram ser tratados manualmente, de modo que os dados utilizados estão disponíveis no arquivo 'mostras.txt'
- Em qualquer seção deste projeto, pode ter sido feito uso de modelos de linguagem generativos para auxiliar na manutenção e criação do código


# Licença
Detalhes sobre a licença do projeto estão na pasta LICENSE.
