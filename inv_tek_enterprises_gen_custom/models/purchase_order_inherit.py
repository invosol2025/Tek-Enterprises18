from odoo import models, fields, api


class PurchaseOrderLineInherit(models.Model):
    _inherit = 'purchase.order.line'

    category_id = fields.Many2one('product.category', 'Category')
    brand_id = fields.Many2one('brand.name', 'Brand')
