"""
Script para recriar as tabelas de conquistas com os valores padrão corretos
"""
from sqlalchemy import text
from app.database import engine

SQL = """
DROP TABLE IF EXISTS hero_achievement;
DROP TABLE IF EXISTS achievement;

CREATE TABLE achievement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    flavor_text TEXT,
    icon VARCHAR(100),
    objective_type VARCHAR(100),
    objective_value INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE hero_achievement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievement(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hero_achievement (hero_id, achievement_id)
);
"""

if __name__ == "__main__":
    with engine.connect() as conn:
        # Executar cada statement separadamente
        for statement in SQL.split(';'):
            statement = statement.strip()
            if statement:
                print(f"Executando: {statement[:50]}...")
                conn.execute(text(statement))
                conn.commit()
    print("✅ Tabelas recriadas com sucesso!")
