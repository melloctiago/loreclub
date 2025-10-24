
# Backend do LoreClub

Este é o backend da plataforma de gerenciamento de missões (Kanban) LoreClub.

## Setup (Configuração)

1.  **Crie um Ambiente Virtual:**
    ```bash
    python -m venv venv
    source venv/Scripts/activate 
    ```

2.  **Instale as Dependências:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` a partir do `.env.example` e preencha com as informações do seu banco de dados MySQL e uma chave secreta para JWT.
    ```bash
    cp .env.example .env

    ```

4.  **Execute as Migrações do Banco de Dados:**
    ```bash
    alembic upgrade head
    ```

5.  **Execute o Servidor:**
    ```bash
    uvicorn app.main:app --reload
    ```

O servidor estará disponível em `http://127.0.0.1:8000` e a documentação da API (Swagger) em `http://127.0.0.1:8000/docs`.
