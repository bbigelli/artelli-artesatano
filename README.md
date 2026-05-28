# 🌿 Artelli Artesanato — Full Stack E-commerce

Site premium de artesanato personalizado com Backend FastAPI + PostgreSQL e Frontend React/TypeScript.

---

## 🚀 Como executar

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados

### 1. Clone e configure

```bash
# Copie o .env de exemplo (já vem configurado para dev)
cp backend/.env.example backend/.env
```

### 2. Suba os serviços

```bash
docker-compose up --build
```

### 3. Acesse

| Serviço     | URL                              |
|-------------|----------------------------------|
| Frontend    | http://localhost:5173            |
| Backend API | http://localhost:8000            |
| Docs (Swagger) | http://localhost:8000/docs    |
| Redoc       | http://localhost:8000/redoc      |

---

## 👤 Credenciais padrão (seed)

```
Usuário: admin
Senha:   admin123
E-mail:  admin@artelli.com
```

> ⚠️ Altere a senha em produção!

---

## 🔐 Autenticação

- JWT Bearer Token via `POST /api/auth/token`
- Senha com hash bcrypt
- Rotas admin protegidas por `is_admin = true`

---

## 📡 Endpoints principais

### Auth
```
POST   /api/auth/token          Login → retorna JWT
GET    /api/auth/me             Dados do usuário logado
```

### Usuários
```
POST   /api/users/register      Cadastro público
GET    /api/users/me            Perfil (auth)
PUT    /api/users/me            Atualizar perfil (auth)
GET    /api/users/              Listar usuários (admin)
PUT    /api/users/{id}          Atualizar usuário (admin)
DELETE /api/users/{id}          Excluir usuário (admin)
```

### Produtos
```
GET    /api/products/           Listar produtos (público)
GET    /api/products/featured   Destaques (público)
GET    /api/products/{id}       Detalhe produto (público)
GET    /api/products/slug/{slug}
POST   /api/products/           Criar produto (admin)
PUT    /api/products/{id}       Atualizar produto (admin)
DELETE /api/products/{id}       Excluir produto (admin)
GET    /api/products/admin/all  Todos os produtos (admin)
```

### Categorias
```
GET    /api/products/categories
POST   /api/products/categories   (admin)
PUT    /api/products/categories/{id} (admin)
DELETE /api/products/categories/{id} (admin)
```

---

## ⚙️ Variáveis de ambiente

| Variável | Descrição | Padrão dev |
|----------|-----------|------------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://artelli:artelli123@db:5432/artelli_db` |
| `SECRET_KEY` | Chave JWT (alterar em prod!) | `artelli-dev-secret-...` |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token | `60` |
| `WHATSAPP_NUMBER` | Número para checkout | `5511999999999` |

---

## 🛒 Fluxo de checkout

1. Cliente adiciona produtos ao carrinho
2. Opcionalmente, preenche campo de personalização por produto
3. Clica em **"Finalizar via WhatsApp"**
4. O sistema monta a mensagem com todos os itens e redireciona para o WhatsApp

---

## 🎨 Design System

| Token | Valor |
|-------|-------|
| Verde principal | `#2C5F2E` |
| Verde claro | `#5A9E64` |
| Areia/Gold | `#C9AA7C` |
| Creme (fundo) | `#FAF7F2` |
| Fonte display | Cormorant Garamond |
| Fonte corpo | DM Sans |

---

## 🏭 Produção

1. Altere `SECRET_KEY` para um valor aleatório seguro:
   ```bash
   openssl rand -hex 32
   ```
2. Configure um domínio real no `nginx.conf`
3. Use HTTPS (Certbot/Let's Encrypt)
4. Configure `CORS` origins no `main.py` com seu domínio
5. Nunca comite o `.env` em repositórios públicos

---

## 📦 Tecnologias

**Backend**
- FastAPI 0.111
- SQLAlchemy 2.0 (ORM)
- PostgreSQL 15
- Pydantic v2
- python-jose (JWT)
- passlib + bcrypt

**Frontend**
- React 18 + TypeScript
- Vite 5
- React Router v6
- Axios
- react-hot-toast
- lucide-react
- CSS puro (design system proprietário)

---

Desenvolvido para a **Artelli Artesanato**
