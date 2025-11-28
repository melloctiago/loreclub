import requests

BASE_URL = "http://localhost:8000/api/v1"

def create_user(username, email, password):
    url = f"{BASE_URL}/heroes/"
    data = {"username": username, "email": email, "password": password}
    response = requests.post(url, json=data)
    if response.status_code == 201:
        return response.json()

    url = f"{BASE_URL}/auth/token"
    data = {"username": username, "password": password}
    response = requests.post(url, data=data)
    try:
        return response.json()
    except:
        print(f"Falha no login alternativo: {response.status_code} {response.text}")
        return {}

def get_token(username, password):
    url = f"{BASE_URL}/auth/token"
    data = {"username": username, "password": password}
    response = requests.post(url, data=data)
    json_resp = response.json()
    if "access_token" not in json_resp:
        print(f"Falha no login: {response.status_code} {response.text}")
        return None
    return json_resp["access_token"]

def verify_gamification():
    print("Verificando Lógica de Gamificação...")
    
    # Cria o user
    import random
    rand_id = random.randint(1000, 9999)
    username = f"test_hero_{rand_id}"
    email = f"test_hero_{rand_id}@example.com"
    password = "password123"
    
    print(f"Criando/Logando usuário {username}...")
    user_data = create_user(username, email, password)
    token = user_data.get("access_token") or get_token(username, password)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Inicializa os status
    me_url = f"{BASE_URL}/heroes/me"
    me = requests.get(me_url, headers=headers).json()
    initial_xp = me["xp"]
    initial_coins = me["coins"]
    initial_level = me["level"]
    print(f"Estatísticas Iniciais: Nível {initial_level}, XP {initial_xp}, Moedas {initial_coins}")
    
    # Cria as quests
    print("Criando uma Missão...")
    quest_data = {
        "title": "Test Quest",
        "description": "Testing gamification",
        "guild_board_id": 1,
        "xp_reward": 100,
        "coin_reward": 50,
        "difficulty": "Medium"
    }
    
    quest_url = f"{BASE_URL}/quests/"
    response = requests.post(quest_url, json=quest_data, headers=headers)
    if response.status_code != 201:
        print("Falha ao criar missão:", response.text)
        return
    quest = response.json()
    quest_id = quest["id"]
    print(f"Missão criada: ID {quest_id}")
    
    print("Adicionando Relatório...")
    
    update_url = f"{BASE_URL}/quests/{quest_id}"
    requests.put(update_url, json={"status": "Em Andamento"}, headers=headers)
    
    report_url = f"{BASE_URL}/quests/{quest_id}/report"
    requests.post(report_url, json={"report": "Done!"}, headers=headers)
    
    # Completar a quest
    print("Completando a Missão...")
    response = requests.put(update_url, json={"status": "Missões Concluídas"}, headers=headers)
    if response.status_code != 200:
        print("Falha ao completar missão:", response.text)
        return
    
    # Verifica os status
    print("Verificando Estatísticas...")
    me = requests.get(me_url, headers=headers).json()
    final_xp = me["xp"]
    final_coins = me["coins"]
    final_level = me["level"]
    
    print(f"Estatísticas Finais: Nível {final_level}, XP {final_xp}, Moedas {final_coins}")
    
    if final_xp == initial_xp + 100 and final_coins == initial_coins + 50:
        print("SUCESSO: XP e Moedas atribuídos corretamente!")
    else:
        print("FALHA: As estatísticas não foram atualizadas corretamente.")

if __name__ == "__main__":
    verify_gamification()
