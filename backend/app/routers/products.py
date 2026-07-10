from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])


# ─── Categories ───────────────────────────────────────────────────────────────

@router.get("/categories", response_model=list[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@router.post(
    "/categories",
    response_model=schemas.CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    if crud.get_category_by_slug(db, category.slug):
        raise HTTPException(status_code=400, detail="Slug já em uso")
    return crud.create_category(db, category)


@router.put("/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: int,
    update: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    cat = crud.update_category(db, category_id, update)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return cat


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    cat = crud.delete_category(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")


# ─── Products ─────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[schemas.ProductList])
def list_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    category_id: int | None = None,
    featured: bool = False,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    return crud.get_products(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        featured_only=featured,
        search=search,
    )


@router.get("/featured", response_model=list[schemas.ProductList])
def list_featured(db: Session = Depends(get_db)):
    return crud.get_products(db, featured_only=True, limit=6)


# ─── Admin list all products (including inactive) ─────────────────────────────
# IMPORTANTE: deve ficar ANTES de /{product_id} para não colidir

@router.get("/admin/all", response_model=list[schemas.ProductList])
def admin_list_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    return crud.get_products(db, skip=skip, limit=limit, active_only=False)


@router.get("/slug/{slug}", response_model=schemas.ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = crud.get_product_by_slug(db, slug)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product


@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    if crud.get_product_by_slug(db, product.slug):
        raise HTTPException(status_code=400, detail="Slug já em uso")
    return crud.create_product(db, product)


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = crud.update_product(db, product_id, update)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = crud.delete_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")


@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product
