CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_type int NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_contact int NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users(user_type,user_name, user_contact, user_email,  user_password) VALUES (0, 
'test', 17330827, 'test@gmail.com', 'test1234'
);

CREATE TABLE products (
  product_id uuid PRIMARY KEY DEFAULT 
  uuid_generate_v4(),
  product_name VARCHAR(255) NOT NULL,
  product_price INT NOT NULL,
  product_description VARCHAR(255),
  product_image VARCHAR(255),
  product_category VARCHAR(255),
  stock INT,
  times_ordered INT,
  farmer_id VARCHAR(255),
  farmer_name VARCHAR(255)
  
);



INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Potatos 1kg', 60, 'Fresh from our farm', 'potato.png', 'Vegetables', 30, 10,'58846a9d-9ce1-4638-918d-f74b8cd73975', 'Sangay');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Tomatos 200g', 30, 'Fresh from our farm', 'tomato.png', 'Vegetables',190, 3, 'cc4d420c-5724-4263-8d15-9f1301499922', 'Ugyen');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Radish 500g', 80, 'Fresh from our farm', 'radish.png', 'Vegetables', 20, 2,'58846a9d-9ce1-4638-918d-f74b8cd73975', 'Sangay');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Broccoli 1kg', 80, 'Fresh from our farm', 'broccoli.png', 'Vegetables',50, 12, '9654c239-d4f5-4f96-a304-9a40845b9f7e', 'Pema');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Beans 250g', 120, 'Fresh from our farm', 'beans.png', 'Vegetables',34, 12, '3c580a89-e02a-49ba-a501-48a731bfc7cf', 'farmer');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Local Sausage 350g', 220, 'Localy made sausage', 'sausage.png', 'Meat and Poultry', 34, 4, 'cc4d420c-5724-4263-8d15-9f1301499922', 'Ugyen');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
VALUES ('Orange 500g', 80, 'Fresh from our farm', 'orange.png', 'Fruits',50, 12, '9654c239-d4f5-4f96-a304-9a40845b9f7e', 'Pema');
INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name) 
VALUES ('Apple 1kg', 140, 'Fresh from our farm', 'apple.png', 'Fruits', 80, 4, '58846a9d-9ce1-4638-918d-f74b8cd73975',  'Sangay');


UPDATE products
SET product_image = 'tomato.png'
WHERE product_name = 'Apple 1kg';



CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_img TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE orders (
    order_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_id VARCHAR(255),
    farmer_id VARCHAR(255),
    order_status VARCHAR(255),
    cart_items JSON,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    dzongkhag VARCHAR(255),
    location_description VARCHAR(255),
    date VARCHAR(255),
    time VARCHAR(255),
    contact_number VARCHAR(255),
    reject_des VARCHAR(255),
    driver_name VARCHAR(255),
    driver_contact VARCHAR(255),
    vehicle_number VARCHAR(255)
);

INSERT INTO orders (user_id, cart_items, first_name, last_name, dzongkhag, location_description, date, time, contact_number) VALUES (
    1234,
    ARRAY['item1', 'item2', 'item3'],
    'John',
    'Doe',
    'Thimphu',
    'Near the clock tower',
    '2023-04-27',
    '14:30:00',
    17654321
);