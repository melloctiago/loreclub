-- Dropar tabelas se existirem
DROP TABLE IF EXISTS hero_achievement;
DROP TABLE IF EXISTS achievement;

-- Criar tabela achievement com valores padrão corretos
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

-- Criar tabela hero_achievement
CREATE TABLE hero_achievement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievement(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hero_achievement (hero_id, achievement_id)
);
