from sqlalchemy.orm import Session
from sqlalchemy import select
from app import models, schemas
from app.auth import get_password_hash, verify_password


# ─── Users ────────────────────────────────────────────────────────────────────

def get_user(db: Session, user_id: int):
    return db.get(models.User, user_id)


def get_user_by_email(db: Session, email: str):
    return db.execute(select(models.User).where(models.User.email == email)).scalar_one_or_none()


def get_user_by_username(db: Session, username: str):
    return db.execute(
        select(models.User).where(models.User.username == username)
    ).scalar_one_or_none()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.execute(select(models.User).offset(skip).limit(limit)).scalars().all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        phone=user.phone,
        address=user.address,
        city=user.city,
        state=user.state,
        zip_code=user.zip_code,
        hashed_password=hashed,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def admin_update_user(db: Session, user_id: int, user_update: schemas.UserAdminUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        user = get_user_by_email(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


# ─── Categories ───────────────────────────────────────────────────────────────

def get_categories(db: Session, active_only: bool = True):
    q = select(models.Category)
    if active_only:
        q = q.where(models.Category.is_active == True)
    return db.execute(q).scalars().all()


def get_category(db: Session, category_id: int):
    return db.get(models.Category, category_id)


def get_category_by_slug(db: Session, slug: str):
    return db.execute(
        select(models.Category).where(models.Category.slug == slug)
    ).scalar_one_or_none()


def create_category(db: Session, category: schemas.CategoryCreate):
    db_cat = models.Category(**category.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat


def update_category(db: Session, category_id: int, update: schemas.CategoryUpdate):
    db_cat = get_category(db, category_id)
    if not db_cat:
        return None
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(db_cat, field, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat


def delete_category(db: Session, category_id: int):
    db_cat = get_category(db, category_id)
    if db_cat:
        db.delete(db_cat)
        db.commit()
    return db_cat


# ─── Products ─────────────────────────────────────────────────────────────────

def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    category_id: int | None = None,
    featured_only: bool = False,
    active_only: bool = True,
    search: str | None = None,
):
    q = select(models.Product)
    if active_only:
        q = q.where(models.Product.is_active == True)
    if category_id:
        q = q.where(models.Product.category_id == category_id)
    if featured_only:
        q = q.where(models.Product.is_featured == True)
    if search:
        q = q.where(models.Product.name.ilike(f"%{search}%"))
    q = q.offset(skip).limit(limit)
    return db.execute(q).scalars().all()


def count_products(db: Session, active_only: bool = True):
    from sqlalchemy import func
    q = select(func.count(models.Product.id))
    if active_only:
        q = q.where(models.Product.is_active == True)
    return db.execute(q).scalar()


def get_product(db: Session, product_id: int):
    return db.get(models.Product, product_id)


def get_product_by_slug(db: Session, slug: str):
    return db.execute(
        select(models.Product).where(models.Product.slug == slug)
    ).scalar_one_or_none()


def create_product(db: Session, product: schemas.ProductCreate):
    db_prod = models.Product(**product.model_dump())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod


def update_product(db: Session, product_id: int, update: schemas.ProductUpdate):
    db_prod = get_product(db, product_id)
    if not db_prod:
        return None
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(db_prod, field, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod


def delete_product(db: Session, product_id: int):
    db_prod = get_product(db, product_id)
    if db_prod:
        db.delete(db_prod)
        db.commit()
    return db_prod
