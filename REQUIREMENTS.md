# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- INDEX route: 'products/' [GET]
- SHOW route: 'products/:id' [GET]
- CREATE route: 'products/:id' [GET] [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## API Endpoints

### Products

- INDEX route: products/ [GET]
  - Retrieves a list of all products.
- SHOW route: products/:id [GET]
  - Retrieves details of a specific product by its ID.
- CREATE route: products/ [POST] [token required]
  - Creates a new product. Requires authentication.
- Top 5 most popular products: products/top [GET] optional
  - Retrieves the top 5 most popular products.
- Products by category: products/category/:category [GET] optional
  - Retrieves products filtered by a specific category.

### Users

- Index: users/ [GET] [token required]
  - Retrieves a list of all users. Requires authentication.
- Show: users/:id [GET] [token required]
  - Retrieves details of a specific user by their ID. Requires authentication.
- Create: users/ [POST] [token required]
  - Creates a new user. Requires authentication.

### Orders

- Current Order by user: orders/current/:user_id [GET] [token required]
  - Retrieves the current active order for a specific user by their ID. Requires authentication.
- Completed Orders by user: orders/completed/:user_id [GET] [token required] optional
  - Retrieves a list of completed orders for a specific user by their ID. Requires authentication.

## Data Shapes

### Product

Table: Products (id:number, name:string, price:number, category:string[optional])

### User

Table: Users (id:number, firstName:string, lastName:string, password:string)

### Orders

Table: Orders (id:number, products:Array<{ product_id: number [foreign key to Products table], quantity: number }>, user_id:number [foreign key to Users table], status:string)
