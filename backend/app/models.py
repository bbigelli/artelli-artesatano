from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(255), unique=True, index=True, nullable=False)
    username        = Column(String(100), unique=True, index=True, nullable=False)
    full_name       = Column(String(255))
    phone           = Column(String(30))
    address         = Column(String(255))
    city            = Column(String(100))
    state           = Column(String(2))
    zip_code        = Column(String(10))
    hashed_password = Column(String(255), nullable=False)
    is_active       = Column(Boolean, default=True)
    is_admin        = Column(Boolean, default=False)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    slug        = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    is_active   = Column(Boolean, default=True)
    products    = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"
    id                = Column(Integer, primary_key=True, index=True)
    name              = Column(String(255), nullable=False)
    slug              = Column(String(255), unique=True, index=True, nullable=False)
    description       = Column(Text)
    short_description = Column(String(500))
    price             = Column(Float, nullable=False)
    original_price    = Column(Float)
    image_url         = Column(String(500))
    image_url_2       = Column(String(500))
    image_url_3       = Column(String(500))
    is_featured       = Column(Boolean, default=False)
    is_active         = Column(Boolean, default=True)
    is_customizable   = Column(Boolean, default=False)
    production_days   = Column(Integer, default=7)
    category_id       = Column(Integer, ForeignKey("categories.id"))
    created_at        = Column(DateTime, default=datetime.utcnow)
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    category          = relationship("Category", back_populates="products")
