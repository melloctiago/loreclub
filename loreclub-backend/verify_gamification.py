import requests

BASE_URL = "http://localhost:8000/api/v1"

# Helper to create a user
def create_user(username, email, password):
    url = f"{BASE_URL}/heroes/"
    data = {"username": username, "email": email, "password": password}
    response = requests.post(url, json=data)
    if response.status_code == 201:
        return response.json()
    # Try login if exists
    url = f"{BASE_URL}/auth/token"
    data = {"username": username, "password": password}
    response = requests.post(url, data=data)
    try:
        return response.json()
    except:
        print(f"Login fallback failed: {response.status_code} {response.text}")
        return {}

# Helper to get token
def get_token(username, password):
    url = f"{BASE_URL}/auth/token"
    data = {"username": username, "password": password}
    response = requests.post(url, data=data)
    json_resp = response.json()
    if "access_token" not in json_resp:
        print(f"Login failed: {response.status_code} {response.text}")
        return None
    return json_resp["access_token"]

def verify_gamification():
    print("Verifying Gamification Logic...")
    
    # 1. Create User
    import random
    rand_id = random.randint(1000, 9999)
    username = f"test_hero_{rand_id}"
    email = f"test_hero_{rand_id}@example.com"
    password = "password123"
    
    print(f"Creating/Logging in user {username}...")
    user_data = create_user(username, email, password)
    token = user_data.get("access_token") or get_token(username, password)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get initial stats
    me_url = f"{BASE_URL}/heroes/me"
    me = requests.get(me_url, headers=headers).json()
    initial_xp = me["xp"]
    initial_coins = me["coins"]
    initial_level = me["level"]
    print(f"Initial Stats: Level {initial_level}, XP {initial_xp}, Coins {initial_coins}")
    
    # 2. Create Quest
    print("Creating a Quest...")
    quest_data = {
        "title": "Test Quest",
        "description": "Testing gamification",
        "guild_board_id": 1,
        "xp_reward": 100,
        "coin_reward": 50,
        "difficulty": "Medium"
    }
    # Note: create_quest endpoint might not accept rewards in the schema yet if I didn't update QuestCreate schema?
    # I updated QuestBase, so QuestCreate inherits it?
    # Let's check schemas/quest.py again. QuestCreate inherits QuestBase.
    # And QuestBase has the new fields with defaults.
    # So it should work.
    
    quest_url = f"{BASE_URL}/quests/"
    response = requests.post(quest_url, json=quest_data, headers=headers)
    if response.status_code != 201:
        print("Failed to create quest:", response.text)
        return
    quest = response.json()
    quest_id = quest["id"]
    print(f"Quest created: ID {quest_id}")
    
    # 3. Add Report (required to complete)
    print("Adding Report...")
    # Move to In Progress first?
    # Default is QUEST_BOARD.
    # Need to move to IN_PROGRESS to add report?
    # Logic in add_quest_report: if quest.status != QuestStatus.IN_PROGRESS: raise ...
    
    update_url = f"{BASE_URL}/quests/{quest_id}"
    requests.put(update_url, json={"status": "Em Andamento"}, headers=headers)
    
    report_url = f"{BASE_URL}/quests/{quest_id}/report"
    requests.post(report_url, json={"report": "Done!"}, headers=headers)
    
    # 4. Complete Quest
    print("Completing Quest...")
    response = requests.put(update_url, json={"status": "Missões Concluídas"}, headers=headers)
    if response.status_code != 200:
        print("Failed to complete quest:", response.text)
        return
    
    # 5. Verify Stats
    print("Verifying Stats...")
    me = requests.get(me_url, headers=headers).json()
    final_xp = me["xp"]
    final_coins = me["coins"]
    final_level = me["level"]
    
    print(f"Final Stats: Level {final_level}, XP {final_xp}, Coins {final_coins}")
    
    if final_xp == initial_xp + 100 and final_coins == initial_coins + 50:
        print("SUCCESS: XP and Coins awarded correctly!")
    else:
        print("FAILURE: Stats did not update correctly.")

if __name__ == "__main__":
    verify_gamification()
