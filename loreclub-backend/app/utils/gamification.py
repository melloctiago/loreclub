import math

def calculate_level(xp: int) -> int:
    """
    Calcula o nível baseado no XP.
    Fórmula: Nível = 1 + raiz quadrada(XP / 100)
    Exemplo:
    0 XP -> Nível 1
    100 XP -> Nível 2
    400 XP -> Nível 3
    900 XP -> Nível 4
    """
    if xp < 0:
        return 1
    return 1 + int(math.sqrt(xp / 100))
