# -*- coding: utf-8 -*-
{
    'name': 'Website Slides Snippets',
    'version': '1.0.0',
    'sequence': 126,
    'summary': 'Anakut Website Slide Snippets',
    'author': 'Anakut Digital',
    'category': 'Website/Snippet',
    'description': """
Custom snippets for website slide by ANAKUT
===========================================

Featuring

 * Dynamic Slide
""",
    'depends': ["website", "website_slides"],
    'data': [
        # Snippet
        'views/snippets/s_dynamic_slides.xml',
        'views/snippets/snippets.xml',
    ],
    'demo': [

    ],
    'installable': True,
    'application': False,
    'assets': {
        'web.assets_frontend': [
            'website_slides_snippets/static/src/xml/website_slides_snippets.xml',
        ],
    },
    'license': 'LGPL-3',
}
