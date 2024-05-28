# 🍽️ Cantina School Website - Colégio Fantástico

<img src="/frontend/public/img/favicon.ico" alt="Logo" width="100" />

Welcome to the Cantina School Website repository! This project provides a comprehensive solution for managing a school canteen at **Colégio Fantástico**, where students can purchase products. With a robust permission system and an affiliate system, it offers a seamless experience for both administrators and users.

## ✨ Features

- **School Canteen Management:** 🥪 Students can browse and purchase products.
- **Permission System:** 🔒 Role-based access control for different user types.
- **Affiliate System:** 🤝 Encourage users to invite others.
- **Post-payment System:** 💳 Flexible payment options for users.
- **Database Models:** 🗃️ Well-structured database models for users, products, payments, affiliations, and more.
- **Modern Stack:** 🚀 Implemented using Next.js for the frontend and Flask for the backend.

## 🚀 Getting Started

### 1. Deploy Using Docker

Ensure you have Docker installed on your machine. To deploy the application, simply run the following command:

```bash
docker-compose up -d
```

This command will create and start three applications:

1. **Nginx:** 🌀 Acts as a reverse proxy, handling requests on a dedicated network and forwarding them to the appropriate service (Next.js on port 3000 and Flask on port 5000).
2. **Next.js:** 🌐 The frontend application, exposed on port 3000 within the network.
3. **Flask:** 🔧 The backend RESTful API, exposed on port 5000 within the network.

The credentials for the created user will be stored in a file named `credentials.txt`.

## 🤝 Contributing

Feel free to fork the project, create a feature branch, and send a pull request. For more information on contributing, you can check my sponsorship details.

## 📬 Contact

- **GitHub:** [@felipeadeildo](https://github.com/felipeadeildo)
- **Email:** oie.eu.sou.um@gmail.com

Happy coding! 🎉

---

### Additional Notes

- To check the status of the Docker containers, you can use `docker ps`.
- To stop the Docker containers, you can use `docker-compose down`.

---

![GitHub Stars](https://img.shields.io/github/stars/felipeadeildo/cantinacf?style=social)
![GitHub Forks](https://img.shields.io/github/forks/felipeadeildo/cantinacf?style=social)
![GitHub Issues](https://img.shields.io/github/issues/felipeadeildo/cantinacf)
![GitHub License](https://img.shields.io/github/license/felipeadeildo/cantinacf)
