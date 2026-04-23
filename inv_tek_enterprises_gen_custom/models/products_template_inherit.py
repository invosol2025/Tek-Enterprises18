from odoo import models, fields, api


class ProductTemplateInherit(models.Model):
    _inherit = 'product.template'

    brand_ids = fields.Many2many('brand.name', string='Brand Name')

    active = fields.Boolean('Active', default=True)

    def action_approve(self):
        self.active = True

    def action_confirm(self):
        self.active = True

    @api.model
    def create(self, vals):
        record = super(ProductTemplateInherit, self).create(vals)
        record.active = False
        return record


class BrandConfig(models.Model):
    _name = 'brand.name'

    name = fields.Char(string="Brand Name")
