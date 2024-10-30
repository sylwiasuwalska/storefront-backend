# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

- INDEX route: products/ [GET]
  - Retrieves a list of all products.
- SHOW route: products/:id [GET]
  - Retrieves details of a specific product by its ID.
- CREATE route: products/ [POST] [token required]
  - Creates a new product. Requires authentication.

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
- Create order: orders/ [POST] [token required]
  - Add new order. Requires authentication.

## Data Shapes

### Product

Table: products (id:number, name:string, price:number, category:string)

### User

Table: users (id:number, first_name:string, last_name:string, password:string)

### Orders

Table: orders (id:number, user_id:number [foreign key to Users table],status:string)

Table: ordered_products (order_id:number, product_id:number [foreign key to Products table], quantity:number)
