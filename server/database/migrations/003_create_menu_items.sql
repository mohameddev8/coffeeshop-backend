CREATE TYPE item_type AS ENUM ('coffee', 'bun', 'other');

CREATE TABLE IF NOT EXISTS menu_items (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL UNIQUE,
    description   TEXT          NOT NULL,
    price         NUMERIC(10,2) NOT NULL,
    type          item_type     NOT NULL,
    is_available  BOOLEAN       NOT NULL DEFAULT true,
    category_id   INTEGER       NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);