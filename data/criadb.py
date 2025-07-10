import re
import uuid
import json
from datetime import datetime
import psycopg2

# --- Configurações do Banco ---
DB_CONFIG = {
    'host': 'localhost',
    'dbname': 'cine_review', 
    'user': 'cine_admin',
    'password': 'senha6871',
    'port': 5432
}

# Mapeamento de meses em pt para número
MONTHS = {
    'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
    'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
    'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
}

def setup_database(conn):
    """Garante que as tabelas 'Movies' e 'Sessions' existam."""
    with conn.cursor() as cur:
        # Cria um tipo ENUM para os locais de cinema, se não existir
        cur.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theater') THEN
                    CREATE TYPE THEATER AS ENUM ('CINUSP_NOVA_SALA', 'CINUSP_MARIA_ANTONIA');
                END IF;
            END$$;
        """)

        # Cria a tabela de filmes se não existir
        cur.execute("""
            CREATE TABLE IF NOT EXISTS Movies (
                id SERIAL PRIMARY KEY,
                title TEXT UNIQUE, -- Título deve ser único para a referência funcionar
                show_link TEXT,
                movie_link TEXT,
                image_link TEXT,
                sessions JSONB, -- Usando JSONB para armazenar o array de sessões
                movie_info TEXT,
                country TEXT,
                country_type TEXT,
                year TEXT,
                year_type TEXT,
                duration TEXT,
                duration_type TEXT,
                director TEXT,
                director_type TEXT,
                exhibition_id INTEGER,
                no_reviews INTEGER DEFAULT 0,
                total_rating INTEGER DEFAULT 0
            );
        """)

        # Cria a tabela de sessões se não existir (para ser usada por populatesessions)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS Sessions (
                id SERIAL PRIMARY KEY,
                movie_id INTEGER NOT NULL REFERENCES Movies(id) ON DELETE CASCADE,
                theater THEATER,
                date TIMESTAMP
            );
        """)
        conn.commit()
        print("Banco de dados verificado e tabelas garantidas.")

def extract_value(block, field):
    """Procura por uma linha e retorna o valor correspondente."""
    pattern = rf'^{field}:\s*(.+)$'
    m = re.search(pattern, block, re.MULTILINE)
    return m.group(1).strip() if m else ''

def tipo_generico(s: str):
    """Retorna 'vários' se tiver delimitadores, senão o próprio valor."""
    if any(sep in s for sep in [',', ';', ' e ', '-']):
        return 'vários'
    return s.strip()

def parse_sessions(lines):
    """Extrai lista de sessões para o JSON."""
    sessions = []
    for ln in lines:
        m = re.match(r'.*Data:\s*(\d{1,2}) de (\w+) de (\d{4}), Hora:\s*(\d{1,2})h(\d{2})', ln)
        if m:
            dia, mes_pt, ano, hh, mm = m.groups()
            dt = datetime(int(ano), MONTHS[mes_pt.lower()], int(dia), int(hh), int(mm))
            session_id = str(uuid.uuid4())
            sessions.append({'id': session_id, 'datetime': dt.isoformat()})
    return sessions

def parse_block(block, current_show_link):
    """Parseia um único bloco de filme."""
    title = extract_value(block, 'Título')
    image = extract_value(block, 'Imagem')
    movie_link = extract_value(block, 'Link')
    
    sess_lines = re.findall(r'- .*', block.split('Sinopse:')[0])
    sessions = parse_sessions(sess_lines)
    
    sinopse = extract_value(block, 'Sinopse')
    texto = extract_value(block, 'Texto da equipe')
    
    movie_info = sinopse
    if texto:
        movie_info += '\n' + texto

    pais = extract_value(block, 'País')
    ano_str = extract_value(block, 'Ano')
    year_type = 'vários' if tipo_generico(ano_str) == 'vários' else (int(ano_str) if ano_str.isdigit() else None)

    dur_str = extract_value(block, 'Duração')
    m_d = re.search(r'(\d+)', dur_str)
    duration_type = 'vários' if tipo_generico(dur_str) == 'vários' else (int(m_d.group(1)) if m_d else None)

    direc_str = extract_value(block, 'Direção')
    director_type = 'vários' if tipo_generico(direc_str) == 'vários' else (direc_str or None)

    return {
        'title':          title,
        'show_link':      current_show_link,
        'movie_link':     movie_link,
        'image_link':     image,
        'sessions_json':  json.dumps(sessions),
        'country':        pais,
        'country_type':   'vários' if tipo_generico(pais) == 'vários' else pais,
        'year':           ano_str,
        'year_type':      year_type,
        'duration':       dur_str,
        'duration_type':  duration_type,
        'director':       direc_str,
        'director_type':  director_type,
        'movie_info':     movie_info
    }

def main():
    with open('mostras.txt', encoding='utf-8') as f:
        text = f.read()

    parts = re.split(r'=== MOSTRA:\s*(\S+)\s*===', text)
    records = []
    for i in range(1, len(parts), 2):
        show_link = parts[i]
        bloco = parts[i+1]
        filmes = re.split(r'(?=Título: )', bloco)
        for fm in filmes:
            if fm.strip().startswith('Título:'):
                rec = parse_block(fm, show_link)
                records.append(rec)

    conn = psycopg2.connect(**DB_CONFIG)
    
    setup_database(conn)
    
    with conn.cursor() as cur:
        for r in records:
            #filmes nao podem ter nomes iguais 
            cur.execute("""
                INSERT INTO Movies
                    (title, show_link, movie_link, image_link, sessions, movie_info,
                     country, country_type, year, year_type,
                     duration, duration_type, director, director_type)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (title) DO NOTHING
            """, (
                r['title'], r['show_link'], r['movie_link'], r['image_link'],
                r['sessions_json'], r['movie_info'],
                r['country'], r['country_type'], r['year'], r['year_type'],
                r['duration'], r['duration_type'], r['director'], r['director_type']
            ))
    conn.commit()
    conn.close()
    print(f'Processados {len(records)} filmes com sucesso.')

if __name__ == '__main__':
    main()