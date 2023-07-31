# -*- coding: utf-8 -*-
{
    'name': 'eCommerce Snippets',
    'version': '1.0.0',
    'sequence': 126,
    'summary': 'Anakut eCommerce Snippets',
    'author': 'Anakut Digital',
    'category': 'Website/Snippet',
    'description': """
Custom snippets for eCommerce by ANAKUT
=======================================

Featuring

 * Dynamic Category
 * Dynamic Category Row
""",
    'depends': ["website", "website_sale", "sale", "product"],
    'data': [
        # Snippet
        'views/snippets/s_dynamic_categories.xml',
        'views/snippets/s_dynamic_categories_row.xml',
        'views/snippets/snippets.xml',
    ],
    'demo': [

    ],
    'installable': True,
    'application': False,
    'assets': {
        'web.assets_frontend': [
            'e_commerce_snippets/static/src/xml/e_commerce_snippets.xml',
        ],
    },
    'license': 'LGPL-3',
}
