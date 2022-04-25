### Installation
1. Before following this steps, environment variables must be define in **config.env**
   
2. Copy Files
```sh 
git clone https://github.com/user109436/Medical-Services-Management-App.git
```
1. Open Directory in VS Code or Any Text Editor
2. Install Packages in main directory (Server Level)
```sh
npm install
```
4. Run Database Seeds or Dummy Data 
```sh
cd utils
node database
```
5. Install Packages in client folder (Client Level)
```sh
cd client
npm install
```
6. Run project on developement (will run server and client)
```sh
npm run develop
```
6. Run Server Only (Optional)
```sh
npm run server
```
6. Run Client Only (Optional)
```sh
cd client
npm start
```