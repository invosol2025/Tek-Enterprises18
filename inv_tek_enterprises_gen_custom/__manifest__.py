{
    'name': 'InvTek Custom',
    'version': '18.0.1.0.0',
    'summary': 'Enhancements for Product, Sale & Purchase',

    'description': """
                   Lightweight customizations including:
                   - Product Brand support
                   - Category & Brand in Sale/Purchase lines
                   - Dynamic product filtering
                   - Partner-based pricelist handling
                   """,

    'author': 'Ahsan Ismail',
    'maintainer': 'Ahsan Ismail',

    'category': 'Inventory',
    'license': 'LGPL-3',

    'depends': ['base', 'product', 'stock', 'sale', 'purchase'],

    'data': [
        'security/ir.model.access.csv',
        'security/security.xml',
        'views/products_template_inherit_views.xml',
        'views/sale_order_inherit_views.xml',
        'views/purchase_order_inherit_views.xml',
    ],

    'images': ['static/description/src/icon.png'],

    'installable': True,
    'application': True,
}
