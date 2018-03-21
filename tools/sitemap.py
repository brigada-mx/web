"""
DEPENDENCIES:
pip3 install requests

USAGE:
python3 tools/sitemap.py
"""
import requests


SITEMAP_TEMPLATE = """<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>https://app.brigada.mx/organizaciones</loc>
</url>
<url>
<loc>https://app.brigada.mx/cuenta</loc>
</url>
{}</urlset>
"""

URL_TEMPLATE = """<url>
<loc>{}</loc>
</url>
"""


def org_url(pk):
    return f'https://app.brigada.mx/organizaciones/{pk}'


def generate_sitemap(urls):
    elements = [URL_TEMPLATE.format(url) for url in urls]
    return SITEMAP_TEMPLATE.format(''.join(elements))


if __name__ == '__main__':
    r = requests.get('https://api.brigada.mx/api/organizations/', params={'page_size': 1000})
    r.raise_for_status()
    urls = [org_url(org['id']) for org in r.json()['results']]
    with open('dist/sitemap.xml', 'w') as file:
        file.write(generate_sitemap(urls))
