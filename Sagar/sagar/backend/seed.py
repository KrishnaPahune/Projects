from sqlmodel import Session, select
from .models import Product
from .db import engine


def seed_db() -> None:
    """Insert example products if none exist."""
    with Session(engine) as session:
        existing = session.exec(select(Product)).all()
        if existing:
            return

        products = [
            Product(
                name='LG OLED55C2 Smart TV',
                description="4K OLED Smart TV with AI upscaling",
                price=119900.0,
                image='LGOLed55.jpg',
                category='Smart TVs',
                stock=10,
            ),
            Product(
                name='Samsung QLED 65" QN90B',
                description="65-inch Quantum Dot LED TV with Mini LED backlighting",
                price=159900.0,
                image='tv2.avif',
                category='Smart TVs',
                stock=8,
            ),
            Product(
                name='Sony Bravia 55X90J',
                description="55-inch 4K HDR Smart TV with HDMI 2.1",
                price=99900.0,
                image='tv3.jpeg',
                category='Smart TVs',
                stock=12,
            ),
            Product(
                name='Whirlpool 285L Neo Frost Refrigerator',
                description='Side-by-side refrigerator with no-frost technology',
                price=36990.0,
                image='fridge1.png',
                category='Refrigerators',
                stock=6,
            ),
            Product(
                name='LG 260L Frost-Free Refrigerator',
                description='Double door refrigerator with inverter compressor',
                price=34990.0,
                image='fridge2.jpg',
                category='Refrigerators',
                stock=7,
            ),
            Product(
                name='IFB 8kg Front Load Washing Machine',
                description='Fully automatic front load washing machine with steam',
                price=27990.0,
                image='wm1.jpg',
                category='Washing Machines',
                stock=5,
            ),
            Product(
                name='Samsung 7.5kg Fully-Automatic Washing Machine',
                description='Top load washing machine with wobble technology',
                price=19990.0,
                image='wm2.webp',
                category='Washing Machines',
                stock=9,
            ),
            Product(
                name='Daikin 1.5 Ton Inverter AC',
                description='Inverter split AC with eco mode',
                price=39990.0,
                image='ac1.webp',
                category='Air Conditioners',
                stock=7,
            ),
        ]

        session.add_all(products)
        session.commit()
