<p  align="center"  style="padding: 0;">

<h1  align="center">Tiki clone API specifications</h1>

<h3  align="center"> All requirements for the backend of Tiki clone app
</h3>
</p>

# Update (29/02/2020):
- Docker image:
``` $ docker pull phuongminh2303/tiki-api ```
- Todo: 
- [ ] Goole OAuth2
- [ ] Image Upload
- [x] Containerize API
- [ ] Caching with Redis
- [ ] Server and Load Balancer
- [ ] Update Order model and controller for updating orders
- [ ] Statistics routes for admins

## Shop:

-   List all products in a shop

-   List all shops in general  
	- Pagination, limit, ….

-   Create new shop
	-  User must log in first
    - User must be “seller” or “admin”
    -  Only the owner can create products for that shop
    - Seller can create multiples products
  
-   Update shop
    -  Only the owner of the shop
-   Delete shop:
	- Only the owner of the shop

## Product:

- List all products in the database
    - Pagination
    - Select specific fields in result
    - Limit number of results
    - Filter by fields
    

- Search products by category
   - Something here will be added later
    
- Get single product
- Create new product
	- User must login first
	- User must be “seller” or “admin”
    - Field validation
-   Upload photo for product
    - Only the seller of that product can upload image
    - Photo is saved in local filesystem
-   Update product
	- Only the seller of that product
    - Validation on update
-   Delete product
	- Only the seller of that product
-   Calculate average rating

## Order:

-   User must login first
-   Only the “user” role
-   List all orders
	- Paging, limit, sorting
    - Can be used to display history
-   Create new order
	- In the product route
    - Field validation
    - Receive successful email when finish
-   Update order
	- Only the owner of that order
	- Available to update within 2 days
-   Delete order
	- Only the owner of that order
   
## Reviews

-   List all reviews for a product 
-   Get a single review    
-   Create a review:
	- User must login first
    - User must be “user” or “admin”
-   Update review
	- Only the owner of that review
-   Delete review
	- Only the owner of that review
    
## User & Authentication

- Authentication is implemented with JWT/cookies
	- They expires in 7 days
-   User registration
	- Register as a “user” or “seller” only
	- When user sign up, a token will be send with a cookie
	- Password will be hashed
-   User login
	- User uses email and password (Oauth and confirm account in the future)
	- Password will be compared with stored hash password
	- When user log in, a token will be send with a cookie
-   User logout
	- Remove cookie (cookie = none)
-   Get user info
	- Get all user information using token
-   Password reset
	- User can request to reset password
	- A hashed token will be sent to the user’s email
	- User can click on link to make new password
    - Token will expire in 10 mins

-   Update user info
	- User must login first

-   User crud:
	- Admin only
	- Admin can only be set by Phuong manually
    
## Security

-   Encrypt passwords and tokens
    
-   Prevent NoSQL injections
    
-   Use helmet and prevent cross site scripting
    
-   Add rate limit (100 request/ 10 mins)
    
-   Prevent http param polution
    
-   Public the API with CORS
    
## Server (Add later)

-   Enable firewall
    
-   Use NGINX reverse proxy
    
-   Improve later if still have time
