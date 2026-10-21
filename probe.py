import shutil
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=shutil.which('chromium'))
    pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.goto('http://localhost:8080/health/features',wait_until='networkidle')
    n=pg.locator('figure[aria-label^="Animated sample"]').count()
    print('figures',n)
    print(pg.evaluate("getComputedStyle(document.body).backgroundColor"), pg.evaluate("getComputedStyle(document.body).fontFamily"))
    f=pg.locator('figure[aria-label^="Animated sample"]').first
    f.scroll_into_view_if_needed(); pg.wait_for_timeout(9000)
    f.screenshot(path='/tmp/v3/fig.png')
    print(f.bounding_box())
    b.close()
