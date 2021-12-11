from random import randint

def random_number_grided(min, max, grid):
    return (randint(min, max) * grid) // grid              