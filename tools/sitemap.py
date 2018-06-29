"""
DEPENDENCIES:
pip3 install requests

USAGE:
python3 tools/sitemap.py
"""
import requests


SITEMAP_TEMPLATE = """<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>https://app.brigada.mx/reconstructores</loc>
</url>
<url>
<loc>https://app.brigada.mx/donadores</loc>
</url>
<url>
<loc>https://app.brigada.mx/voluntarios</loc>
</url>
<url>
<loc>https://app.brigada.mx/cuenta</loc>
</url>
<url>
<loc>https://app.brigada.mx/donador</loc>
</url>
{}</urlset>
"""

URL_TEMPLATE = """<url>
<loc>{}</loc>
</url>
"""


def org_url(pk):
    return f'https://app.brigada.mx/reconstructores/{pk}'


def donor_url(pk):
    return f'https://app.brigada.mx/donadores/{pk}'


def opportunity_url(pk):
    return f'https://app.brigada.mx/voluntariado/{pk}'


def generate_sitemap(urls):
    elements = [URL_TEMPLATE.format(url) for url in urls]
    return SITEMAP_TEMPLATE.format(''.join(elements))


if __name__ == '__main__':
    r = requests.get('https://api.brigada.mx/api/organizations/', params={'page_size': 1000}, timeout=15)
    r.raise_for_status()
    org_urls = [org_url(org['id']) for org in r.json()['results']]

    r = requests.get('https://api.brigada.mx/api/donors/', params={'page_size': 1000}, timeout=15)
    r.raise_for_status()
    donor_urls = [donor_url(donor['id']) for donor in r.json()['results']]

    r = requests.get('https://api.brigada.mx/api/volunteer_opportunities/', params={'page_size': 1000}, timeout=15)
    r.raise_for_status()
    opportunity_urls = [opportunity_url(o['id']) for o in r.json()['results']]

    with open('dist/sitemap.xml', 'w') as file:
        file.write(generate_sitemap(org_urls + donor_urls + opportunity_urls))
