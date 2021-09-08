insert into products(id, title, description, price)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        'Ducky One 2 SF RGB LED 65% Double Shot PBT Mechanical Keyboard',
        'some desc1', random() * 100 + 5),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'Vortex Race 3 TKL Dye Sub PBT Mechanical Keyboard', 'test2 desc',
        random() * 100 + 5),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'Varmilo VA87M Moonlight White LED TKL Dye Sub PBT Mechanical Keyboard',
        'test3', random() * 100 + 5),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        'Obinslab Anne Pro 2 White RGB LED 60% Double Shot PBT Mechanical Keyboard', 'test4 desc',
        random() * 100 + 5),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1',
        'Ducky One 2 RGB TKL Pudding Edition RGB LED Double Shot PBT Mechanical Keyboard', 'test5',
        random() * 100 + 5),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 'Vortex Core Dye Sub PBT Mechanical Keyboard', 'test6 desc',
        random() * 100 + 5),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 'Leopold FC750R Grey/Blue PD TKL Double Shot PBT Mechanical Keyboard',
        'test6 desc', random() * 100 + 5);

insert into stocks (product_id, count)
select id, (random() * 10 + 5)
from products;
