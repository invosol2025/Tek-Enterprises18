from odoo import models, fields, api


class ProductTemplateInherit(models.Model):
    _inherit = 'product.template'

    brand_ids = fields.Many2many('brand.name', string='Brand Name')


class BrandConfig(models.Model):
    _name = 'brand.name'

    name = fields.Char(string="Brand Name")
