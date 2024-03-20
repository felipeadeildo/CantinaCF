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

Follow these steps to get the project up and running:

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

#### 1. **Home Page**

- **Route:** `index`
- **Description:** The landing page of the application, providing an overview of the available features.

#### 2. **Login Page**

- **Route:** `login`
- **Description:** Allows users to log in to access the application.

#### 3. **Logout**

- **Route:** `logout`
- **Description:** Endpoint to log out users from the application.

#### 4. **Cantina**

- **Route:** `cantina`
- **Description:** Main page for the school canteen where students can browse and purchase products.

#### 5. **Profile**

- **Route:** `profile`
- **Description:** Users can view and edit their profile information.

#### 6. **Users**

- **Route:** `users`
- **Description:** Administrators can manage user accounts, including adding, editing, and removing users.

#### 7. **Recharge**

- **Route:** `recharge`
- **Description:** Users can request balance recharges, specifying the value and payment method.

#### 8. **Payment History**

- **Route:** `payments_history`
- **Description:** View the history of payments made by users, with options to filter and export data.

#### 9. **Products for Dispatch**

- **Route:** `products_for_despache`
- **Description:** Manage the dispatch of products that have been sold.

#### 10. **Sales History**

- **Route:** `sales_history`
- **Description:** View the history of sales, with options to filter by date and user.

#### 11. **Product Management**

- **Route:** `products`
- **Description:** View and edit the list of products available in the canteen.

#### 12. **Stock Control**

- **Route:** `stock_control`
- **Description:** Manage the stock of products, including adding new products and viewing stock history.

#### 13. **Affiliates**

- **Route:** `affiliates`
- **Description:** Manage affiliate relationships between users.

#### 14. **Routes Management (Admin)**

- **Route:** `routes`
- **Description:** View and edit the application's routes (Admin only).

#### 15. **Page Categories Management (Admin)**

- **Route:** `category_pages`
- **Description:** Manage the categories of pages within the application (Admin only).

#### 16. **Roles Management (Admin)**

- **Route:** `roles`
- **Description:** Manage user roles and permissions within the application (Admin only).

#### 17. **Pages Management (Admin)**

- **Route:** `pages`
- **Description:** Manage the pages within the application, including titles and descriptions (Admin only).

## Contributing

Feel free to fork the project, create a feature branch, and send us a pull request.

## Contact

- GitHub: [@sr-pato](https://github.com/sr-pato)
- Email: oie.eu.sou.um@gmail.com

Happy coding!
