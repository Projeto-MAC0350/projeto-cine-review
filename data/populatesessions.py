import re
import uuid
from datetime import datetime
import psycopg2

DB_CONFIG = {
    'host': 'localhost',
    'dbname': 'cine_review',
    'user': 'cine_admin',
    'password': 'senha6871',
    'port': 5432
}

MONTHS = {
    'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
    'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
    'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
}


THEATER_MAP = {
    'CINUSP - Nova Sala': 'CINUSP_NOVA_SALA',
    'Cinusp Maria Antônia': 'CINUSP_MARIA_ANTONIA',
}

def parse_sessions(sess_lines):
    sessions = []
    for ln in sess_lines:
        m = re.match(r'.*Data:\s*(\d{1,2}) de (\w+) de (\d{4}), Hora:\s*(\d{1,2})h(\d{2}), Local: (.+)', ln)
        if m:
            dia, mes_pt, ano, hh, mm, local = m.groups()
            dt = datetime(int(ano), MONTHS[mes_pt.lower()], int(dia), int(hh), int(mm))
            theater = THEATER_MAP.get(local.strip(), None)
            if theater:
                sessions.append({'datetime': dt, 'theater': theater})
    return sessions

def main():
    with open('mostras.txt', encoding='utf-8') as f:
        text = f.read()

    parts = re.split(r'=== MOSTRA:\s*(\S+)\s*===', text)
    session_records = []
    for i in range(1, len(parts), 2):
        bloco = parts[i+1]
        filmes = re.split(r'(?=Título: )', bloco)
        for fm in filmes:
            if fm.strip().startswith('Título:'):
                title_match = re.search(r'Título:\s*(.+)', fm)
                if not title_match:
                    continue
                title = title_match.group(1).strip()
                sess_lines = re.findall(r'- Data:.*', fm)
                sessions = parse_sessions(sess_lines)
                for sess in sessions:
                    session_records.append({'title': title, **sess})

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    for sess in session_records:
        # Find movie_id by title
        cur.execute("SELECT id FROM Movies WHERE title = %s", (sess['title'],))
        movie_row = cur.fetchone()
        if not movie_row:
            print(f"Movie not found: {sess['title']}")
            continue
        movie_id = movie_row[0]
        # Insert session
        cur.execute("""
            INSERT INTO sessions (movie_id, theater, date)
            VALUES (%s, %s, %s)
        """, (movie_id, sess['theater'], sess['datetime']))
    conn.commit()
    cur.close()
    conn.close()
    print(f'Inseridos {len(session_records)} sessões com sucesso.')

if __name__ == '__main__':
    main()