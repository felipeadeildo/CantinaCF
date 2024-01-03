# Cantina School Website

![Cantina Logo](/cantina/static/img/favicon.ico)

Welcome to the Cantina School Website repository! This project is focused on providing a comprehensive solution for managing a school canteen where students can purchase products. With a beautiful permission system and an affiliate system, it offers a seamless experience for both administrators and users.

## Features

- **School Canteen Management:** Students can browse and purchase products.
- **Permission System:** Role-based access control for different user types.
- **Affiliate System:** Encourage users to invite others.
- **Database Models:** Well-structured database models for users, products, payments, affiliations, and more.
- **Routes and Pages Management:** Easily manage the application's routes and pages.

## Getting Started

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

### 2. Initialize the Database

```bash
flask --app cantina initdb
```

### 3. Create Superuser

```bash
flask --app cantina createsuperuser
```

### 4. Run the Server

```bash
python3 run_server.py
```

Use `-H` for help.

## Database Models

The project includes various models such as `User`, `Product`, `PaymentMethod`, `Affiliation`, `Payroll`, `EditHistory`, `StockHistory`, and more. Check the code for detailed structure and relationships.

## Routes, Pages, and Default Settings

The application includes a set of predefined routes, pages, and settings. You can find functions like `initdb` and `createsuperuser` in the code to initialize the database, add default payment methods, routes, categories, pages, roles, and create a superuser.

### Pages and Routes

<details>
<summary>Click to view all routes</summary>

#### 1. **Home Page**

- **Route:** `index`
- **Description:** The landing page of the application, providing an overview of the available features.
- **Preview:** ![Home Page Preview](/src/img/home.png)

#### 2. **Login Page**

- **Route:** `login`
- **Description:** Allows users to log in to access the application.
- **Preview:** ![Login Page Preview](/src/img/login.png)

#### 3. **Logout**

- **Route:** `logout`
- **Description:** Endpoint to log out users from the application.

#### 4. **Cantina**

- **Route:** `cantina`
- **Description:** Main page for the school canteen where students can browse and purchase products.
- **Preview:** ![Cantina Preview](/src/img/cantina.png)

#### 5. **Profile**

- **Route:** `profile`
- **Description:** Users can view and edit their profile information.
- **Preview:** ![Profile Preview](/src/img/profile.png)

#### 6. **Users**

- **Route:** `users`
- **Description:** Administrators can manage user accounts, including adding, editing, and removing users.
- **Preview:** ![Users Preview](/src/img/users.png)

#### 7. **Recharge**

- **Route:** `recharge`
- **Description:** Users can request balance recharges, specifying the value and payment method.
- **Preview:** ![Recharge Preview](/src/img/recharge.png)

#### 8. **Payment History**

- **Route:** `payments_history`
- **Description:** View the history of payments made by users, with options to filter and export data.
- **Preview:** ![Payment History Preview](/src/img/payments_history.png)

#### 9. **Products for Dispatch**

- **Route:** `products_for_despache`
- **Description:** Manage the dispatch of products that have been sold.
- **Preview:** ![Products for Dispatch Preview](/src/img/products_for_despache.png)

#### 10. **Sales History**

- **Route:** `sales_history`
- **Description:** View the history of sales, with options to filter by date and user.
- **Preview:** ![Sales History Preview](/src/img/sales_history.png)

#### 11. **Product Management**

- **Route:** `products`
- **Description:** View and edit the list of products available in the canteen.
- **Preview:** ![Product Management Preview](/src/img/products.png)

#### 12. **Stock Control**

- **Route:** `stock_control`
- **Description:** Manage the stock of products, including adding new products and viewing stock history.
- **Preview:** ![Stock Control Preview](/src/img/stock_control.png)

#### 13. **Affiliates**

- **Route:** `affiliates`
- **Description:** Manage affiliate relationships between users.
- **Preview:** ![Affiliates Preview](/src/img/affiliates.png)

#### 14. **Routes Management (Admin)**

- **Route:** `routes`
- **Description:** View and edit the application's routes (Admin only).
- **Preview:** ![Routes Management Preview](/src/img/routes.png)

#### 15. **Page Categories Management (Admin)**

- **Route:** `category_pages`
- **Description:** Manage the categories of pages within the application (Admin only).
- **Preview:** ![Page Categories Management Preview](/src/img/category_pages.png)

#### 16. **Roles Management (Admin)**

- **Route:** `roles`
- **Description:** Manage user roles and permissions within the application (Admin only).
- **Preview:** ![Roles Management Preview](/src/img/roles.png)

#### 17. **Pages Management (Admin)**

- **Route:** `pages`
- **Description:** Manage the pages within the application, including titles and descriptions (Admin only).
- **Preview:** ![Pages Management Preview](/src/img/pages.png)

</details>

## Contributing

Feel free to fork the project, create a feature branch, and send a pull request.

## Contact

- GitHub: [@sr-pato](https://github.com/sr-pato)
- Email: oie.eu.sou.um@gmail.com

Happy coding!
