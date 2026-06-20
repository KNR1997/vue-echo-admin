<p align="center">
  <a href="https://github.com/KNR1997/vue-echo-admin">
    <img alt="Vue FastAPI Admin Logo" width="200" src="https://github.com/KNR1997/vue-echo-admin/public/ss/logo.svg">
  </a>
</p>

<h1 align="center">vue-echo-admin</h1>

vue-echo-admin is a modern front-end and back-end separation development platform that combines Golang(Echo), Vue3, and Naive UI. It incorporates RBAC (Role-Based Access Control) management, dynamic routing, and JWT (JSON Web Token) authentication, making it ideal for rapid development of small to medium-sized applications and also serves as a valuable learning resource.

> **Note**: This repository contains only the frontend part of the application. The backend repository that connects with this frontend can be found at: [Backend Repository URL - https://github.com/KNR1997/go-echo-starter]

### Features
- **Popular Tech Stack**: The backend is developed with the high-performance asynchronous framework FastAPI using Python 3.11, while the front-end is powered by cutting-edge technologies such as Vue3 and Vite, complemented by the efficient package manager, pnpm.
- **Code Standards**: The project is equipped with various plugins for code standardization and quality control, ensuring consistency and enhancing team collaboration efficiency.
- **Dynamic Routing**: Backend dynamic routing combined with the RBAC model allows for fine-grained control of menus and routing.
- **JWT Authentication**: User identity verification and authorization are handled through JWT, enhancing the application's security.
- **Granular Permission Control**: Implements detailed permission management including button and interface level controls, ensuring different roles and users have appropriate permissions.

### Live Demo
- URL: https://vue-echo-admin.vercel.app
- Username: admin@demo.com
- Password: demodemo

### Screenshots

#### Login Page
![Login Page](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/login.jpg)

#### Workbench
![Workbench](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/workbench.jpg)

#### User Management
![User Management](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/users.jpg)

#### Role Management
![Role Management](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/role-management.jpg)

#### Menu Management
![Menu Management](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/menu-management.jpg)

#### API Management
![API Management](https://github.com/KNR1997/vue-echo-admin/blob/master/public/ss/api-management.png)

### Quick Start
Please follow the instructions below for installation and configuration:

#### Frontend
The frontend project requires a Node.js environment (recommended version 18.8.0 or higher).
- node v18.8.0+

1. Navigate to the frontend project directory:
```sh
cd vue-echo-admin
```

2. Install project dependencies (pnpm is recommended: https://pnpm.io/zh/installation)
```sh
npm i -g pnpm # If pnpm is already installed, skip this step
pnpm i # Or use npm i
```

3. Start the frontend development server:
```sh
pnpm dev
```

### Directory Structure Explanation

```
└── root                  // Front-end web directory
    ├── build             // Build scripts and configuration directory
    │   ├── config        // Build configurations
    │   ├── plugin        // Build plugins
    │   └── script        // Build scripts
    ├── public            // Public resources directory
    │   └── resource      // Public resource files
    ├── settings          // Front-end project settings
    └── src               // Source code directory
        ├── api           // API interface definitions
        ├── assets        // Static resources directory
        │   ├── images    // Image resources
        │   ├── js        // JavaScript files
        │   └── svg       // SVG vector files
        ├── components    // Components directory
        │   ├── common    // Common components
        │   ├── icon      // Icon components
        │   ├── page      // Page components
        │   ├── query-bar // Query bar components
        │   └── table     // Table components
        ├── composables   // Composable functionalities
        ├── directives    // Directives directory
        ├── layout        // Layout directory
        │   └── components // Layout components
        ├── router        // Routing directory
        │   ├── guard     // Route guards
        │   └── routes    // Route definitions
        ├── store         // State management (pinia)
        │   └── modules   // State modules
        ├── styles        // Style files directory
        ├── utils         // Utilities directory
        │   ├── auth      // Authentication related utilities
        │   ├── common    // Common utilities
        │   ├── http      // Encapsulated axios
        │   └── storage   // Encapsulated localStorage and sessionStorage
        └── views         // Views/Pages directory
            ├── error-page // Error pages
            ├── login      // Login page
            ├── profile    // Profile page
            ├── system     // System management page
            └── workbench  // Workbench page
```

### Visitors Count

<img align="left" src = "https://profile-counter.glitch.me/vue-echo-admin/count.svg" alt="Loading">