# -*- coding: utf-8 -*-

from odoo import models


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def session_info(self):
        session_info = super().session_info()
        session_info["no_edit_create_can_create_edit"] = self.env.user.has_group(
            "no_edit_create.group_many2one_create_edit"
        )
        session_info["no_edit_create_can_use_new_button"] = self.env.user.has_group(
            "no_edit_create.group_record_create"
        )
        return session_info
