// Adicionando pacotes TypeScript no npm > npm i typescript
// Executando os pacotes TypeScript > npx tsc --init > cria file tsconfig.json
// Dentro do tsconfig.json > alterado outDir para ./dist/
// Iniciando compilação do TS > npx tsc --watch

// Importando bibliotecas
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'query-string';
import * as url from 'url';
import { writeFile, readFile, unlink } from 'fs';

// Instalando complemento de modulos para TypeScript > npm install @types/node 

//Definição de portas
const port = 5000;

// Regra de negócio
const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  var resposta;

  //Pegar a pergunta na url
  const urlparse = url.parse(request.url ? request.url : '' , true)

  //Receber informações do usuário
  const params = parse(urlparse.search ? urlparse.search : '' );

  //Criar um usuário - Atualizar um usuário
  if(urlparse.pathname == '/criar-usuário'){

    //Salvar informações
    writeFile('users/' + params.id + '.txt', JSON.stringify(params), function(err: any){
      if (err) throw err;
      console.log('Saved!');

      // Confirma salvamento das informações
      resposta = `Hello, ${params.nome}! Dados salvos com sucesso`

      // Resposta sendo apresentada
      response.statusCode = 201;
      response.setHeader('Content-Type', 'text/plain');
      response.end(resposta);
    });
  }   
  // Selecionar usuário
  else if(urlparse.pathname == '/selecionar-usuario'){
    readFile('users/' + params.id + '.txt', function(err: any, data:any){
      resposta = data;

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.end(resposta);
    });
  }

  // Remover usuário
  else if(urlparse.pathname == '/remover-usuario'){
    unlink('users/' + params.id + '.txt', function(err: any){
      console.log('File deleted!');

      resposta = err ? 'Usuario nao encontrado' : 'Usuario removido'

      response.statusCode = 204;
      response.setHeader('Content-Type', 'text/plain');
      response.end(resposta);
    })
  };
});

// Execução
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

//127.0.0.1:3000/criar-usuario?nome=Felipe&idade=100&id=-1
//127.0.0.1:3000/criar-usuario?nome=Felipe&idade=29&id=-1
//127.0.0.1:3000/selecionar-usuario?id=-1
//127.0.0.1:3000/remover-usuario?id=-1