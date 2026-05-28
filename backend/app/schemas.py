from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# ─── Token ────────────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


# ─── User ─────────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: EmailStr
    username: str
    name: str
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None


class UserAdminUpdate(UserUpdate):
    is_active: bool | None = None
    is_admin: bool | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime


class UserList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    username: str
    name: str
    is_active: bool
    is_admin: bool
    created_at: datetime


# ─── Category ─────────────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool


# ─── Product ──────────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    short_description: str | None = None
    price: float
    original_price: float | None = None
    image_url: str | None = None
    image_url_2: str | None = None
    image_url_3: str | None = None
    is_featured: bool = False
    is_active: bool = True
    is_customizable: bool = True
    production_days: int = 7
    category_id: int | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    short_description: str | None = None
    price: float | None = None
    original_price: float | None = None
    image_url: str | None = None
    image_url_2: str | None = None
    image_url_3: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    is_customizable: bool | None = None
    production_days: int | None = None
    category_id: int | None = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: CategoryResponse | None = None
    created_at: datetime
    updated_at: datetime


class ProductList(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    short_description: str | None
    price: float
    original_price: float | None
    image_url: str | None
    is_featured: bool
    is_active: bool
    is_customizable: bool
    production_days: int
    category: CategoryResponse | None = None
