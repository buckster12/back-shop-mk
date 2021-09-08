create table if not exists products
(
    id          uuid primary key default uuid_generate_v4(),
    title       text not null,
    description text,
    price       int
);

create table if not exists stocks
(
    product_id uuid,
    count      int,
    foreign key ("product_id") references "products" ("id")
);
