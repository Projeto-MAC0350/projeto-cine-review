import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re

BASE_URL = "https://cinusp.webhostusp.sti.usp.br"

def get_links_das_5_mostras():
    response = requests.get("https://cinusp.webhostusp.sti.usp.br/mostras")
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    main_section = soup.find('section', class_='main-section')
    if not main_section:
        raise Exception("Seção principal não encontrada!")

    # Encontrando o link de cada mostra:
    i = 0
    mostra_links = []
    for div in main_section.find_all('div', class_='bg_mostra_img'):
        a_tag = div.find('a', href=True)
        if i >= 1:
            break
        if a_tag:
            href = a_tag['href']
            # Para garantir que não pegamos um href errado ou um link repetido:
            if href.startswith('/mostra/') and href not in mostra_links:
                mostra_links.append(BASE_URL + href + "/filmes")
        i += 1

    # Aqui, escolhemos quantas mostras queremos extrair:
    quantidade = 1
    return mostra_links[:quantidade]

def extrair_detalhes_filme(link_filme):
    url_base = "https://cinusp.webhostusp.sti.usp.br"
    res = requests.get(link_filme)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    main_section = soup.find('section', class_='main-section')
    if not main_section:
        return None

    sessoes_raw = main_section.find('div', class_='testeira_filme')
    sessoes = []
    if sessoes_raw:
        for br in sessoes_raw.find_all('br'):
            texto = br.previous_sibling
            if texto and isinstance(texto, str) and '-' in texto:
                partes = texto.strip().split(' - ')
                if len(partes) >= 2:
                    data = partes[0].strip()
                    hora = partes[1].strip()
                    local_tag = br.next_sibling if br.next_sibling and br.next_sibling.name == 'a' else None
                    local = local_tag.get_text(strip=True).lower() if local_tag else ''
                    if 'maria antônia' in local:
                        local = 'Cinusp Maria Antônia'
                    elif 'nova sala' in local:
                        local = 'CINUSP - Nova Sala'
                    elif 'favo' in local or 'colméia' in local:
                        local = 'Favo 04'
                    sessoes.append({'data': data, 'hora': hora, 'local': local})

    sinopse_div = main_section.find('div', class_='sinopse_filme')
    sinopse = ''
    equipe = ''
    if sinopse_div:
        paragrafos = sinopse_div.find_all('p')
        if paragrafos:
            textos_validos = [p.get_text(strip=True) for p in paragrafos if p.get_text(strip=True) and '_' not in p.get_text()]
            if textos_validos:
                sinopse = textos_validos[0]
                equipe = ' '.join(textos_validos[1:])

    nome_original = ''
    pais = ''
    ano = ''
    duracao = ''
    diretor = ''

    ficha_div = sinopse_div
    if ficha_div:
        ps = ficha_div.find_all('p')
        for p in ps:
            texto = p.get_text(strip=True)
            if re.match(r'^[\u3040-\u30ff\u4e00-\u9faf\s\w]+$', texto) and len(texto) < 40:
                nome_original = texto
            elif ',' in texto and "'" in texto:
                partes = [x.strip() for x in texto.split(',')]
                if len(partes) == 3:
                    pais, ano, duracao = partes
                    duracao = duracao.replace("'", " min")
                    duracao.split(sep="min")
                    diretor = duracao[1]
                    duracao = duracao[0] + "min"
    return {
            'sessoes': sessoes,
            'sinopse': sinopse,
            'equipe': equipe,
            'nome_original': nome_original,
            'pais': pais,
            'ano': ano,
            'duracao': duracao,
            'diretor': diretor
        }

def extrair_titulos_filmes(url_mostra_filmes):
    response = requests.get(url_mostra_filmes)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    filmes = soup.find_all('h6')
    return [f.get_text(strip=True) for f in filmes]


def extrair_filmes_com_imagens(url_mostra_filmes):
    response = requests.get(url_mostra_filmes)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    filmes = []
    blocos_filme = soup.find_all('div', class_='column small-12 large-6 filme_info')

    for bloco in blocos_filme:
        titulo_div = bloco.find('div', class_='column small-12')
        titulo_tag = titulo_div.find('h6') if titulo_div else None
        titulo = titulo_tag.get_text(strip=True) if titulo_tag else 'Sem título'

        a_tag = titulo_tag.find('a') if titulo_tag else None
        link = urljoin("https://cinusp.webhostusp.sti.usp.br", a_tag['href']) if a_tag and 'href' in a_tag.attrs else None

        imagem_div = bloco.find('div', class_='column small-5 hide-for-large-up')
        img_tag = imagem_div.find('img') if imagem_div else None
        imagem_url = urljoin("https://cinusp.webhostusp.sti.usp.br/mostras", img_tag['src']) if img_tag and 'src' in img_tag.attrs else None

        detalhes = extrair_detalhes_filme(link) if link else {}

        filme_info = {
            'titulo': titulo,
            'link': link,
            'imagem': imagem_url,
            **detalhes  
        }

        filmes.append(filme_info)

    return filmes


def main():
    urls = get_links_das_5_mostras()
    for url in urls:
        print(f"\n Filmes da mostra: {url}")
        filmes = extrair_filmes_com_imagens(url)
        
        if not filmes:
           print("Nenhum filme encontrado.")
        for f in filmes:
           print("Titulo:", f['titulo'])
           print("Imagem", f['imagem'])
           print("link", f['link'])
           print("sessoes", f['sessoes'])
           print("texto da equipe:", f['equipe'])
           print("nome original:", f['nome_original'])
           print("pais", f['pais'])
           print("ano:", f['ano'])
           print("duracao:", f['duracao'])
           print("direcao:", f['diretor'])


if __name__ == "__main__":
    main()