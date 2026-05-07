CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS orders
(
    id         SERIAL PRIMARY KEY,
    user_id    UUID           NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    status     order_status   NOT NULL DEFAULT 'pending',
    total      NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items
(
    id           SERIAL PRIMARY KEY,
    order_id     INTEGER        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    menu_item_id INTEGER        NOT NULL REFERENCES menu_items (id) ON DELETE RESTRICT,
    quantity     INTEGER        NOT NULL CHECK (quantity > 0),
    price        NUMERIC(10, 2) NOT NULL,
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);