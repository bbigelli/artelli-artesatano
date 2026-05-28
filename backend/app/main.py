from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.routers import auth, users, products
from app import crud, schemas
from app.config import settings
from contextlib import asynccontextmanager

# Função de seed (síncrona)
def seed_database():
    """Seed initial data if DB is empty."""
    db = SessionLocal()
    try:
        # Admin user - verificar por email
        if not crud.get_user_by_email(db, "admin@artelli.com"):
            admin = schemas.UserCreate(
                email="admin@artelli.com",
                name="Administrador Artelli",
                password="admin123",
            )
            user = crud.create_user(db, admin)
            user.is_admin = True
            db.commit()
            print("✅ Admin user created")
        else:
            print("ℹ️ Admin user already exists")

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
                "name": "Oratório em Pedra",
                "slug": "oratorio-pedra",
                "short_description": "Oratório artesanal em pedra com acabamento rústico.",
                "description": "Confeccionado com pedras selecionadas e tratadas, cada oratório carrega a textura e a beleza natural da pedra. Acabamento com verniz que preserva as marcas do tempo.",
                "price": 98.50,
                "original_price": 100.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 8,
                "image_url": "https://artelli-frontend.onrender.com/oratorio_pedras.png",
                "category_id": cat_oratorios.id if cat_oratorios else None,
            },
            {
                "name": "Oratório em Argamassa",
                "slug": "oratorio-argamassa",
                "short_description": "Oratório artesanal em argamassa com detalhes únicos.",
                "description": "Confeccionado com argamassa de alta qualidade, cada oratório carrega a textura e a beleza natural da matéria.",
                "price": 69.90,
                "original_price": 80.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 7,
                "image_url": "https://artelli-frontend.onrender.com/oratorio_argamassa.png",
                "category_id": cat_oratorios.id if cat_oratorios else None,
            },
            {
                "name": "Mini Plaquinhas Decorativas",
                "slug": "mini-plaquinhas-decorativas",
                "short_description": "Peças decorativas em miniatura para complementar sua decoração.",
                "description": "Confeccionadas em madeira, estas plaquinhas trazem um toque artesanal e único para qualquer ambiente. Disponíveis em diversos designs e cores.",
                "price": 2.50,
                "original_price": 4.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 5,
                "image_url": "https://artelli-frontend.onrender.com/mini_plaquinhas.png",
                "category_id": cat_decoracao.id if cat_decoracao else None,
            },
            {
                "name": "Placas Decorativas em Madeira",
                "slug": "placas-decorativas-madeira",
                "short_description": "Placas decorativas em madeira para complementar sua decoração.",
                "description": "Confeccionadas em madeira, estas plaquinhas trazem um toque artesanal e único para qualquer ambiente. Disponíveis em diversos designs e cores.",
                "price": 29.90,
                "original_price": 35.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 8,
                "image_url": "https://artelli-frontend.onrender.com/placas.png",
                "category_id": cat_decoracao.id if cat_decoracao else None,
            },
            {
                "name": "Terrario em Vidro Grande",
                "slug": "terrario-vidro-grande",
                "short_description": "Terrário em vidro grande para plantas, autosustentavel e decorativo.",
                "description": "Confeccionado em vidro, este terrário traz um toque moderno e elegante para qualquer ambiente. Ideal para plantas suculentas e cactos. Autosustentável, requer pouca manutenção e é perfeito para decorar sua casa ou escritório.",
                "price": 130.00,
                "original_price": 180.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 10,
                "image_url": "https://artelli-frontend.onrender.com/terrario_grande.png",
                "category_id": cat_terrarios.id if cat_terrarios else None,
            },
            {
                "name": "Terrario em Vidro Médio",
                "slug": "terrario-vidro-medio",
                "short_description": "Terrário em vidro médio para plantas, autosustentavel e decorativo.",
                "description": "Confeccionado em vidro, este terrário traz um toque moderno e elegante para qualquer ambiente. Ideal para plantas suculentas e cactos. Autosustentável, requer pouca manutenção e é perfeito para decorar sua casa ou escritório.",
                "price": 68.00,
                "original_price": 89.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 10,
                "image_url": "https://artelli-frontend.onrender.com/terrario_medio.png",
                "category_id": cat_terrarios.id if cat_terrarios else None,
            },
            {
                "name": "Terrario em Vidro Pequeno",
                "slug": "terrario-vidro-pequeno",
                "short_description": "Terrário em vidro pequeno para plantas, autosustentavel e decorativo.",
                "description": "Confeccionado em vidro, este terrário traz um toque moderno e elegante para qualquer ambiente. Ideal para plantas suculentas e cactos. Autosustentável, requer pouca manutenção e é perfeito para decorar sua casa ou escritório.",
                "price": 12.00,
                "original_price": 20.00,
                "is_featured": True,
                "is_customizable": True,
                "production_days": 10,
                "image_url": "https://artelli-frontend.onrender.com/terrario_pequeno.png",
                "category_id": cat_terrarios.id if cat_terrarios else None,
            },
        ]

        for prod_data in sample_products:
            if not crud.get_product_by_slug(db, prod_data["slug"]):
                crud.create_product(db, schemas.ProductCreate(**prod_data))
        
        print("✅ Database seeded successfully!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: cria as tabelas (OPERAÇÃO SÍNCRONA)
    Base.metadata.create_all(bind=engine)
    
    # Chama o seed
    seed_database()
    
    yield
    # Shutdown: fecha conexões (OPERAÇÃO SÍNCRONA)
    engine.dispose()


# Cria o app
app = FastAPI(
    title="Artelli Artesanato API",
    description="API completa para e-commerce de artesanato personalizado",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://artelli-frontend.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://frontend",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)

# Rotas públicas
@app.get("/")
def root():
    return {"status": "ok", "message": "Artelli Artesanato API is running 🌿"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.get("/api/config/whatsapp")
def whatsapp_config():
    return {"number": settings.WHATSAPP_NUMBER}