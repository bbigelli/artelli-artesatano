from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Username deve ter ao menos 3 caracteres")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class AdminUserUpdate(UserUpdate):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    is_active: bool
    is_admin: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    is_active: bool
    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    image_url_2: Optional[str] = None
    image_url_3: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True
    is_customizable: bool = False
    production_days: int = 7
    category_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    image_url_2: Optional[str] = None
    image_url_3: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    is_customizable: Optional[bool] = None
    production_days: Optional[int] = None
    category_id: Optional[int] = None


class ProductList(BaseModel):
    id: int
    name: str
    slug: str
    short_description: Optional[str]
    price: float
    original_price: Optional[float]
    image_url: Optional[str]
    is_featured: bool
    is_active: bool
    is_customizable: bool
    production_days: int
    category: Optional[CategoryResponse]
    model_config = {"from_attributes": True}


class ProductResponse(ProductList):
    description: Optional[str]
    image_url_2: Optional[str]
    image_url_3: Optional[str]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
