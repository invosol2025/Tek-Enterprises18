{
    "name": "Hide Create & Edit",
    "version": "18.0.1.0.0",
    "summary": "Hide create and edit actions across Odoo except for allowed users",
    "description": """
Hide Create & Edit
==================

This module hides create and edit actions across the Odoo backend by default.
Users who belong to the "Access Create & Edit" group keep the standard create
and edit behavior.

Features:
---------
* Hide create buttons in form, list and kanban views.
* Hide edit mode access in form views.
* Hide create/create and edit options in many2one and many2many tags fields.
* Restrict add/create actions in one2many and many2many subviews.
* Keep the implementation UI-based, without changing ACLs or record rules.
""",
    "author": "Tek Enterprises",
    "category": "Tools",
    "license": "LGPL-3",
    "depends": ["base", "web"],
    "data": [
        "security/security.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "tek_hide_create_edit/static/src/js/hide_create_edit.js",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
