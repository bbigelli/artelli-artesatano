from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.routers import auth, users, products
from app import crud, schemas
from app.config import settings
from contextlib import asynccontextmanager
from .database import engine
from .models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: cria as tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: fecha conexões
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Artelli Artesanato API",
    description="API completa para e-commerce de artesanato personalizado",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://frontend"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Artelli Artesanato API is running 🌿"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.get("/api/config/whatsapp")
def whatsapp_config():
    return {"number": settings.WHATSAPP_NUMBER}


def seed_database():
    """Seed initial data if DB is empty."""
    db = SessionLocal()
    try:
        # Admin user
        if not crud.get_user_by_username(db, "admin"):
            admin = schemas.UserCreate(
                email="admin@artelli.com",
                username="admin",
                full_name="Administrador Artelli",
                password="admin123",
            )
            user = crud.create_user(db, admin)
            user.is_admin = True
            db.commit()

        # Categories
        categories = [
            {"name": "Terrários", "slug": "terrarios", "description": "Jardins em miniatura encapsulados em vidro"},
            {"name": "Oratórios", "slug": "oratorios", "description": "Oratórios artesanais feitos argamassa/pedras e detalhes únicos"},
            {"name": "Decoração", "slug": "decoracao", "description": "Peças decorativas exclusivas para sua casa"},
            {"name": "Presentes", "slug": "presentes", "description": "Itens perfeitos para presentear com exclusividade"},
        ]
        for cat_data in categories:
            if not crud.get_category_by_slug(db, cat_data["slug"]):
                crud.create_category(db, schemas.CategoryCreate(**cat_data))

        # Sample products
        cat_terrarios = crud.get_category_by_slug(db, "terrarios")
        cat_oratorios = crud.get_category_by_slug(db, "oratorios")
        cat_decoracao = crud.get_category_by_slug(db, "decoracao")

        sample_products = [
            {
                "name": "Terrário Geométrico Premium",
                "slug": "terrario-geometrico-premium",
                "short_description": "Terrário aberto em formato geométrico com plantas suculentas selecionadas.",
                "description": "Cada peça é montada manualmente com suculentas selecionadas e decorada com pedras e musgo natural. O vaso geométrico de vidro transparente realça a beleza de cada detalhe. Ideal para mesas, aparadores e home offices.",
                "price": 189.90,
                "original_price": 220.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 5,
                "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
                "category_id": cat_terrarios.id if cat_terrarios else None,
            },
            {
                "name": "Terrário Fechado Tropical",
                "slug": "terrario-fechado-tropical",
                "short_description": "Ecossistema em miniatura com plantas tropicais e camadas decorativas.",
                "description": "Um ecossistema autossustentável dentro de um pote de vidro. As plantas tropicais criam um microclima único e praticamente não precisam de cuidados. Uma obra de arte viva para a sua casa.",
                "price": 249.90,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 7,
                "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
                "category_id": cat_terrarios.id if cat_terrarios else None,
            },
            {
                "name": "Oratório Rústico em Madeira",
                "slug": "oratorio-rustico-madeira",
                "short_description": "Oratório artesanal em madeira de demolição com acabamento natural.",
                "description": "Confeccionado com madeira de demolição selecionada e tratada, cada oratório carrega a história e a textura única da madeira. Acabamento com verniz natural que preserva as marcas do tempo.",
                "price": 320.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 10,
                "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
                "category_id": cat_oratorios.id if cat_oratorios else None,
            },
            {
                "name": "Quadro Macramê Boho",
                "slug": "quadro-macrame-boho",
                "short_description": "Quadro decorativo em macramê com design boho exclusivo.",
                "description": "Tecido à mão com linha de algodão orgânico, este painel traz textura e sofisticação para qualquer ambiente. Disponível em tamanhos e cores personalizados.",
                "price": 145.00,
                "is_featured": False,
                "is_customizable": True,
                "production_days": 8,
                "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
                "category_id": cat_decoracao.id if cat_decoracao else None,
            },
            {
                "name": "Vaso Cimento Orgânico",
                "slug": "vaso-cimento-organico",
                "short_description": "Vaso artesanal em cimento com formas orgânicas e acabamento fosco.",
                "description": "Moldado à mão, cada vaso é único. O cimento com pigmentação natural cria peças com aparência mineral e sofisticada, perfeitas para plantas pequenas e suculentas.",
                "price": 89.90,
                "is_featured": False,
                "is_customizable": True,
                "production_days": 5,
                "image_url": "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600",
                "category_id": cat_decoracao.id if cat_decoracao else None,
            },
            {
                "name": "Kit Presente Artelli",
                "slug": "kit-presente-artelli",
                "short_description": "Kit curado com terrário + vela artesanal + cartão personalizado.",
                "description": "O presente perfeito para quem aprecia beleza e exclusividade. O kit inclui um terrário de suculentas, vela aromatizada artesanal e um cartão personalizado escrito à mão.",
                "price": 289.90,
                "original_price": 350.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 7,
                "image_url": "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600",
                "category_id": None,
            },
        ]

        for prod_data in sample_products:
            if not crud.get_product_by_slug(db, prod_data["slug"]):
                crud.create_product(db, schemas.ProductCreate(**prod_data))

    finally:
        db.close()


@app.on_event("startup")
def startup_event():
    seed_database()
