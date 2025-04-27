# Course Online Shop Backend 🛠️

![GitHub Stars](https://img.shields.io/github/stars/Sina-Ghiasi/course-online-shop-backend?style=flat&color=brightgreen)
![GitHub Issues](https://img.shields.io/github/issues/Sina-Ghiasi/course-online-shop-backend?style=flat&color=blue)
![GitHub License](https://img.shields.io/github/license/Sina-Ghiasi/course-online-shop-backend?style=flat&color=orange)
![GitHub Repo Size](https://img.shields.io/github/repo-size/Sina-Ghiasi/course-online-shop-backend?style=flat&color=purple)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Sina-Ghiasi/course-online-shop-backend)
![GitHub Last Commit](https://img.shields.io/github/last-commit/Sina-Ghiasi/course-online-shop-backend?style=flat&color=cyan)
![Express](https://img.shields.io/badge/Express-404d59?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white)

Welcome to the **Course Online Shop Backend** repository! This project serves as the backbone of the Course Online Shop, handling data management, user authentication, and course transactions. 🚀

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Related Repositories](#related-repositories)
- [Contributing](#contributing)
- [License](#license)

## 📖 Overview

The backend provides a robust API for the Course Online Shop, enabling the frontend to perform CRUD operations, manage user sessions, and process payments. It is built with scalability and security in mind.

## 🛠️ Technologies Used

- **Node.js** 🟢
- **Express.js** 🌐
- **MongoDB** 🍃
- **JWT** for authentication 🔒

## 🚀 Getting Started

Follow these steps to set up the backend locally:

### Prerequisites

- Node.js (v16 or higher) 📦
- MongoDB (local or cloud instance) 🗄️
- npm or Yarn 🧶

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sina-Ghiasi/course-online-shop-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd course-online-shop-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following environment variables:

   ```env
   PORT=5000
   MONGO_DB_URI=mongodb://localhost:27017/course-shop
   JWT_ACCESS_TOKEN_SECRET=your_jwt_access_secret
   JWT_ACCESS_EXPIRES_IN=1h
   JWT_OTP_TOKEN_SECRET=your_jwt_otp_secret
   JWT_OTP_EXPIRES_IN=10m
   JWT_RESET_PASS_TOKEN_SECRET=your_jwt_reset_pass_secret
   JWT_RESET_PASS_EXPIRES_IN=15m
   KAVEEGAR_API_KEY=your_kaveegar_api_key
   KAVEEGAR_API_TEMPLATE=your_kaveegar_template
   SPOT_PLAYER_API=your_spot_player_api_key
   ```

5. Start the server:
   ```bash
   npm start
   ```

The API should now be running at `http://localhost:5000`. 🎉

## 🔗 Related Repositories

This backend powers the API for the frontend application. Check out the related repository:

- [Course Online Shop Frontend](https://github.com/Sina-Ghiasi/course-online-shop-frontend) 🚀

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository 🍴
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request 📬

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
