# watsonRfo

## Install
* Install Node.js
* Install pm2 ``` $ npm install pm2 ```
```
npm install
```

## Serviço Watson
* Criar [Serviço no bluemix](https://console.ng.bluemix.net/catalog/services/natural-language-understanding?taxonomyNavigation=apps)

## Configurar
* Preencher os dados de login e senha:
```
var nlu = new NaturalLanguageUnderstandingV1({
  username: "",
  password: "",
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});
```

## Iniciar o servidor

```
$ node watson.js
```
