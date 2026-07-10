from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app import models, schemas
from app.auth import get_password_hash, verify_password


# ── Users ──────────────────────────────────────────────────
def get_user(db: Session, user_id: int): return db.query(models.User).filter(models.User.id == user_id).first()
def get_user_by_email(db: Session, email: str): return db.query(models.User).filter(models.User.email == email).first()
def get_user_by_username(db: Session, username: str): return db.query(models.User).filter(models.User.username == username).first()
def get_users(db: Session, skip=0, limit=100): return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump(exclude={"password"}), hashed_password=get_password_hash(user.password))
    db.add(db_user); db.commit(); db.refresh(db_user); return db_user

def update_user(db: Session, user_id: int, update: schemas.UserUpdate):
    u = get_user(db, user_id)
    if not u: return None
    for k, v in update.model_dump(exclude_unset=True).items(): setattr(u, k, v)
    db.commit(); db.refresh(u); return u

def admin_update_user(db: Session, user_id: int, update: schemas.AdminUserUpdate):
    u = get_user(db, user_id)
    if not u: return None
    for k, v in update.model_dump(exclude_unset=True).items(): setattr(u, k, v)
    db.commit(); db.refresh(u); return u

def delete_user(db: Session, user_id: int):
    u = get_user(db, user_id)
    if not u: return None
    db.delete(u); db.commit(); return u

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(or_(models.User.username == username, models.User.email == username)).first()
    if not user or not verify_password(password, user.hashed_password): return None
    return user


# ── Categories ─────────────────────────────────────────────
def get_categories(db: Session): return db.query(models.Category).filter(models.Category.is_active == True).all()
def get_category_by_slug(db: Session, slug: str): return db.query(models.Category).filter(models.Category.slug == slug).first()

def create_category(db: Session, cat: schemas.CategoryCreate):
    db_cat = models.Category(**cat.model_dump()); db.add(db_cat); db.commit(); db.refresh(db_cat); return db_cat

def update_category(db: Session, cat_id: int, update: schemas.CategoryUpdate):
    c = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not c: return None
    for k, v in update.model_dump(exclude_unset=True).items(): setattr(c, k, v)
    db.commit(); db.refresh(c); return c

def delete_category(db: Session, cat_id: int):
    c = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not c: return None
    db.delete(c); db.commit(); return c


# ── Products ───────────────────────────────────────────────
def get_product(db: Session, product_id: int): return db.query(models.Product).filter(models.Product.id == product_id).first()
def get_product_by_slug(db: Session, slug: str): return db.query(models.Product).filter(models.Product.slug == slug).first()

def get_products(db: Session, skip=0, limit=20, category_id=None, featured_only=False, search=None, active_only=True):
    q = db.query(models.Product)
    if active_only: q = q.filter(models.Product.is_active == True)
    if category_id is not None: q = q.filter(models.Product.category_id == category_id)
    if featured_only: q = q.filter(models.Product.is_featured == True)
    if search:
        t = f"%{search}%"
        q = q.filter(or_(models.Product.name.ilike(t), models.Product.short_description.ilike(t)))
    return q.order_by(models.Product.id).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    p = models.Product(**product.model_dump()); db.add(p); db.commit(); db.refresh(p); return p

def update_product(db: Session, product_id: int, update: schemas.ProductUpdate):
    p = get_product(db, product_id)
    if not p: return None
    for k, v in update.model_dump(exclude_unset=True).items(): setattr(p, k, v)
    db.commit(); db.refresh(p); return p

def delete_product(db: Session, product_id: int):
    p = get_product(db, product_id)
    if not p: return None
    p.is_active = False; db.commit(); return p
