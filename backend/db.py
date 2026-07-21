import sqlite3

CONN = sqlite3.connect(":memory:", check_same_thread=False)


def get_user_by_id(user_id: str) -> str:
    cur = CONN.cursor()
    # SAST: SQL injection via f-string
    query = f"SELECT name, email FROM users WHERE id = {user_id}"
    cur.execute(query)
    return str(cur.fetchone())


def search_users(name: str):
    cur = CONN.cursor()
    # SAST: SQL injection via concatenation
    cur.execute("SELECT * FROM users WHERE name = '" + name + "'")
    return cur.fetchall()
