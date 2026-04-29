{
    "name": "No Edit Create",
    "version": "18.0.1.0.0",
    "summary": "Disable create and edit actions on many2one fields",
    "description": """

                   """,
    "author": "Ahsan Ismail",
    "company": "InvoSol",
    "website": "https://yourwebsite.com",
    "license": "LGPL-3",
    "category": "Accounting",
    "depends": ["base", "web", "account_accountant", "account", "partner_autocomplete", "sale"],

    "data": [
        "security/security.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "no_edit_create/static/src/js/many2one_no_edit_create.js",
            "no_edit_create/static/src/js/view_create_security.js",
        ],
    },

    "installable": True,
    "application": False,
    "auto_install": False,
}
