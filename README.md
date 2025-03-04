### 🚀 Tech-MVC - Simple, Fast, and Scalable MVC for Node.js!

>note: this is currently under development 

### 🚀 Features

* __Automatic Controller Loading__ : Automatically imports and registers controllers.
* __Dynamic Routing__: Routes requests to corresponding class methods.
* __Simple REST API Structure__: Follow the /Controller/Method pattern.
* __Lightweight and Fast__: No unnecessary dependencies, optimized for performance.

### 📦 Installation

``` npm install tech-mvc  ```

### 📂 Project Structure

``` /your-project
 ├── /controllers  # Controllers directory (user-defined)
 │    ├── Home.js  # Example controller
 ├── index.js      # Entry point of your application
 ├── package.json  
 ```

### 🛠 Usage
  ## 1️⃣ Create an Entry File (index.js)
``` 
 import { Server } from "tech-mvc";

const server = new Server("./controllers", 3000);
await server.loadControllers();
server.start();
 ```
  ## 2️⃣ Create a Controller (controllers/Home.js)
```
class Home {
    GET() {
        return { message: "Welcome to Tech-MVC!" };
    }
}
export default Home;
```

## 3️⃣ Start the Server

 ```
 node index.js
 ```

 ## 4️⃣ Access Your API
```
curl http://localhost:3000/Home/GET
```
✅ Response:
```
{ "message": "Welcome to Tech-MVC!" }
```

### 📜 License

This project is licensed under the MIT License.

### 🛠 Contributing
Contributions are welcome! Feel free to submit a pull request.

### 📞 Support

For issues or feature requests, please open an issue on GitHub.