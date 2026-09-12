```
Feito por Nathan e Pedro Bragante.

Modalidade escolhida: 4. Projeto Integrador / TCC (Bentotech)
Recursos nativos utilizados: 1. Localização (GPS) 2. Magnetômetro (Bússola)

O projeto original já estava desenvolvido em React e Vite. Como a atividade
precisava ser feita em Expo, nos criamos um projeto em Expo na pasta AppExpo
e coloquei a aplicação React que já existia dentro de uma WebView, usando a
biblioteca React Native WebView. A aplicação fica hospedada e o Expo abre esse
endereço dentro da WebView. 

No entanto no App.js utilizamos o expo-sensors para acessar o magnetômetro.
Então o Expo fica como a parte nativa do aplicativo e o React/Vite continua
sendo usado na parte principal da aplicação, incluindo o recurso de localizaçao.

Para o recurso de localização, utilizamos a API de geolocalização do navegador,
 porem continua sendo um recurso nativo, apenas a forma como eu acessamos ele muda.
 Ela acompanha a posição do usuário e retorna a latitude, longitude e a precisão
da leitura. Depois, eu transformo essas coordenadas em uma posição dentro do mapa 3D,
e essa posição é usada para movimentar o personagem em teoria.

Como usar:

React:
cd AppReact
npm i
npm run vite

seguir localhost:5173

connectar no dominio da cloudflare:
cloudflared tunnel run --token $CLOUDFLARE_TOKEN

Expo:
cd AppExpo
npm i
npx expo start
(tem que estar com o tunnel da cloudflare, ou outro, ativo no dominio indicado em App.js)
```
