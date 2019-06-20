const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')

function ensureArray(contribution) {
    if (!contribution) {
        contribution = []
    } else if (typeof(contribution) === 'string') {
        contribution = [contribution]
    }
    return contribution
}

exports.responseProcessor = function(req, res) {
    const cookieName = app.name + '-cookies-accepted'

    // If cookie is set, no cookie line is needed
    if (req.cookies[cookieName] == 'true') {
        return res
    }

    // If requested through the content studio, no cookie line is needed
    if (req.mode === 'edit') {
        return res
    }

    // Set up model and view
    const view = resolve('cookie-line.html')
    const siteConfig = portal.getSiteConfig()

    const model = {
        cookieName: cookieName,
        title: siteConfig['cookie-line-text-title'],
        intro: siteConfig['cookie-line-text-intro'],
        order: siteConfig['cookie-line-order'],
        acceptButton: siteConfig['cookie-line-text-accept'],
        readMoreButton: siteConfig['cookie-line-text-read-more'],
        readMoreLink: portal.pageUrl({
            id: siteConfig['cookie-line-link']
        }),
        layout: siteConfig['cookie-line-layout'],
        hasLayout: siteConfig['cookie-line-layout'] !== 'none'
    }

    // If layout is requested, include css
    if (siteConfig['cookie-line-layout'] !== 'none') {
        const stylesheetHTML = `<link rel="stylesheet" href="${portal.assetUrl({ path: 'styles.css' })}">`
        res.pageContributions.headEnd = ensureArray(res.pageContributions.headEnd)
        res.pageContributions.headEnd.push(stylesheetHTML)
    }

    // Render HTML to append
    const html = thymeleaf.render(view, model)

    // Append HTML to bottom of body
    res.pageContributions.bodyEnd = ensureArray(res.pageContributions.bodyEnd)
    res.pageContributions.bodyEnd.push(html)

    return res
}
