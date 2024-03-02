import os

import pandas as pd
from werkzeug.security import generate_password_hash

from cantina import app, db
from cantina.models import Role, User


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def copy_to_db(df: pd.DataFrame):
    default_password = input("Defina uma senha padrão para os usuários: ")
    default_password = generate_password_hash(default_password)
    for index, row in df.iterrows():
        user_data = {
            "matricula": row["Matrícula"],
            "name": row["Nome do aluno"],
            "role_id": role_aluno.id,
            "role": role_aluno,
            "serie": row["Série"],
            "turm": row["Turma"].split()[0].strip('"'),
            "password": default_password,
        }
        splited_name = row["Nome do aluno"].split()
        username = f"{splited_name[0]}.{splited_name[1]}".lower()
        users = User.query.filter(User.username.ilike(f"{username}%")).all()
        if users:
            user_data["username"] = f"{username}{len(users)}"
        else:
            user_data["username"] = username
        db.session.add(User(**user_data))
        print(f"\rAdicionando usuário {index} de {len(df)}", end="", flush=True)
    print("\nCommitando alterações...")
    db.session.commit()
    print("Feito!")


def get_df():
    clear_screen()
    excels = [f for f in os.listdir() if f.endswith(".xlsx")]
    if not excels:
        print("Nenhum arquivo encontrado!")
        return
    print("Escolha o arquivo a ser copiado:")
    for i, excel in enumerate(excels, 1):
        print(f"({i}) {excel}")
    df = pd.read_excel(excels[int(input("\n>> ")) - 1])
    print("Arquivo lido com sucesso! Iniciando a cópia...")
    copy_to_db(df)


if __name__ == "__main__":
    with app.test_request_context():
        role_aluno = Role.query.filter(Role.name == "Aluno").first()
        get_df()
